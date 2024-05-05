from django.contrib.auth.models import User
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class Profile(models.Model):
    MALE = "M"
    FEMALE = "F"
    GENDER_CHOICES = [
        (MALE, "Чоловіча"),
        (FEMALE, "Жіноча"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    main_photo = models.ImageField(
        upload_to="images/profiles_main_photos/", null=True, blank=True
    )
    date_of_birth = models.DateField()
    life_status = models.CharField(max_length=200, null=True, blank=True)
    about_me = models.TextField(null=True, blank=True)
    gender = models.CharField(
        max_length=1, choices=GENDER_CHOICES, null=True, blank=True
    )
    phone_number = PhoneNumberField()
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.user.username


class ProfilePhoto(models.Model):
    profile = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="profile_photos"
    )
    image = models.ImageField(upload_to="images/profiles_profile_photos/")
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-id"]
