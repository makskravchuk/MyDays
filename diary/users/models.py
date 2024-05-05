from django.contrib.auth.models import User
from django.db import models


class Friendship(models.Model):
    PENDING = "pending"
    ACCEPTED = "accepted"
    STATUS_CHOICES = (
        (PENDING, "На розгляді"),
        (ACCEPTED, "Прийнятий"),
    )

    from_user = models.ForeignKey(
        User, related_name="friendships_initiated", on_delete=models.CASCADE
    )
    to_user = models.ForeignKey(
        User, related_name="friendships_received", on_delete=models.CASCADE
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.from_user} - {self.to_user}  [{self.status}]"
