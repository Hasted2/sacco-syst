from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Loan
from .serializers import LoanSerializer
from .models import LoanRepayment
from .serializers import LoanRepaymentSerializer
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from decimal import Decimal
from accounts.models import Account
from users.models import Profile
from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render
from django.db.models import Sum
from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_loans(request):
    loans = Loan.objects.filter(user=request.user).order_by('-date')
    serializer = LoanSerializer(loans, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_repayments(request, loan_id):
    try:
        loan = Loan.objects.get(id=loan_id, user=request.user)
    except Loan.DoesNotExist:
        return Response({"detail": "Loan not found"}, status=404)

    repayments = LoanRepayment.objects.filter(loan=loan).order_by("-date")
    serializer = LoanRepaymentSerializer(repayments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_loans(request):
    if not request.user.is_staff: 
        return Response({"detail": "Not authorized"}, status=403)

    loans = Loan.objects.all().order_by('-date')
    serializer = LoanSerializer(loans, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_loan(request):
    amount = request.data.get("amount")
    national_id = request.data.get("national_id")
    reason = request.data.get("reason", "") 
    user = request.user

    profile = getattr(user, "profile", None)
    if not profile:
        return Response({"detail": "Profile not found"}, status=400)

    if not profile.national_id:
        if not national_id:
            return Response({"detail": "National ID is required"}, status=400)
        profile.national_id = national_id
        profile.save()
    elif national_id and national_id != profile.national_id:
        return Response({"detail": "National ID mismatch"}, status=400)

    # Validate amount
    try:
        loan_amount = Decimal(amount)
    except Exception:
        return Response({"detail": "Invalid amount format"}, status=400)

    if loan_amount < Decimal("10"):
        return Response({"detail": "The amount must be above Ksh10"}, status=400)

    # Create loan
    loan = Loan.objects.create(
        user=user,
        amount=loan_amount,
        status="Pending",
        date=timezone.now(),
        reason=reason
    )

    serializer = LoanSerializer(loan)
    return Response({
        "detail": f"Loan application submitted for {loan.amount} KSH",
        "loan": serializer.data
    }, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_loan(request, loan_id):
    # Only staff/admin can approve loans
    if not request.user.is_staff:
        return Response({"detail": "Not authorized"}, status=403)

    try:
        loan = Loan.objects.get(id=loan_id)
        loan.status = "Approved"
        loan.save()

        account, created = Account.objects.get_or_create(user=loan.user)
        account.balance += loan.amount
        account.save()


        # ✅ Send email notification
        send_mail(
            subject="Loan Approved",
            message=f"Dear {loan.user.username}, your loan of {loan.amount} KSH has been approved.",
            from_email=settings.EMAIL_HOST_USER or "noreply@example.com",
            recipient_list=[loan.user.email],
            fail_silently=False,
        )

        return Response({"detail": "Loan approved and email sent. Balance Updated."})
    except Loan.DoesNotExist:
        return Response({"detail": "Loan not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def revoke_loan(request, loan_id):
    if not request.user.is_staff:
        return Response({"detail": "Not authorized"}, status=403)

    try:
        loan = Loan.objects.get(id=loan_id)

        if loan.status != "Approved":
            return Response({"detail": "Only approved loans can be revoked."}, status=400)

        # ✅ Reverse the balance update
        account, created = Account.objects.get_or_create(user=loan.user)
        account.balance -= loan.amount
        account.save()

        # ✅ Update loan status
        loan.status = "Revoked"
        loan.save()

        return Response({"detail": "Loan revoked and balance corrected."})
    except Loan.DoesNotExist:
        return Response({"detail": "Loan not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_repayment(request, loan_id):
    # 1. Validate amount
    amount = request.data.get("amount")
    if not amount:
        return Response({"detail": "Amount is required"}, status=400)

    try:
        # 2. Get loan belonging to this user
        loan = Loan.objects.get(id=loan_id, user=request.user)
    except Loan.DoesNotExist:
        return Response({"detail": "Loan not found"}, status=404)

    amount = Decimal(amount)

    if loan.status != "Approved":
        return Response({"detail": "Only approved loans can be repaid."}, status=400)

    # 3. Check account balance before repayment
    account, created = Account.objects.get_or_create(user=request.user)
    if account.balance < amount:
        return Response({"detail": "Insufficient account balance."}, status=400)

    # 4. Create repayment record
    repayment = LoanRepayment.objects.create(
        loan=loan,
        user=request.user,
        amount=amount,
        date=timezone.now()
    )

    # 5. Update loan balance
    loan.amount -= amount
    if loan.amount <= 0:
        loan.status = "Repaid"
        loan.amount = Decimal("0.00")
    loan.save()

    # 6. Update account balance
    account.balance -= amount
    account.save()

    # 7. Send repayment confirmation email
    send_mail(
        subject="Repayment Received",
        message=f"Dear {request.user.username}, we have received your repayment of {amount} KSH for loan #{loan.id}.",
        from_email=settings.EMAIL_HOST_USER or "noreply@example.com",
        recipient_list=[request.user.email],
        fail_silently=False,
    )

    # 8. Return structured response
    return Response({
        "detail": f"Repayment successful: {amount} KSH for loan #{loan.id}",
        "balance": str(account.balance),
        "repayment": LoanRepaymentSerializer(repayment).data
    }, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_unpaid_loans(request):
    loans = Loan.objects.filter(user=request.user, status="Approved")
    serializer = LoanSerializer(loans, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_loan(request, loan_id):
    if not request.user.is_staff:
        return Response({"detail": "Not authorized"}, status=403)

    try:
        loan = Loan.objects.get(id=loan_id)
        loan.status = "Rejected"
        loan.save()

        subject = "Loan Application Rejected"
        message = (
            f"Dear {loan.user.username},\n\n"
            f"Your loan application for {loan.amount} KSH has been rejected.\n"
            f"Reason: {loan.reason or 'No reason provided'}\n\n"
            f"Regards,\nLoan Admin Team"
        )
        recipient = [loan.user.email]

        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient)

        return Response({"detail": "Loan rejected."})
    except Loan.DoesNotExist:
        return Response({"detail": "Loan not found"}, status=404)

def is_admin(user):
    return user.is_staff

@user_passes_test(is_admin)
def transactions_report(request):
    loans = Loan.objects.select_related("user").order_by("-date")
    repayments = LoanRepayment.objects.select_related("loan", "user").order_by("-date")
    return render(request, "reports/transactions_report.html", {
        "loans": loans,
        "repayments": repayments,
    })

@user_passes_test(is_admin)
def repayments_by_user(request):
    users = User.objects.annotate(total_repaid=Sum("loanrepayment__amount"))
    return render(request, "reports/repayments_by_user.html", {"users": users})

@api_view(["GET"])
@permission_classes([IsAdminUser])  # ✅ only staff/admin can access
def repayments_by_user_api(request):
    users = User.objects.annotate(total_repaid=Sum("loanrepayment__amount"))

    data = []
    for u in users:
        # Get all loans for this user
        loans = Loan.objects.filter(user=u).prefetch_related("repayments")

        loan_data = []
        for loan in loans:
            repaid_amount = sum(r.amount for r in loan.repayments.all())
            loan_data.append({
                "loan_id": loan.id,
                "original_amount": loan.amount + repaid_amount,
                "current_balance": loan.amount,
                "repaid_amount": repaid_amount,
                "status": loan.status,
                "date": loan.date,
            })

        data.append({
            "user_id": u.id,
            "username": u.username,
            "total_repaid": u.total_repaid or 0,
            "loans": loan_data,
        })

    return Response(data)
