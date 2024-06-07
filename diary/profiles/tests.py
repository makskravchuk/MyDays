# Create your tests here.
import tempfile
from datetime import date

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase
from django.urls import reverse
from profiles.models import ProfilePhoto, Profile


class ProfileViewTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user_credentials = {
            'username': 'testuser',
            'password': 'secret'
        }
        self.user = User.objects.create_user(**self.user_credentials)
        Profile.objects.create(user=self.user, date_of_birth=date(2000, 1, 1))

    def test_profile_view_get(self):
        self.client.login(username='testuser', password='secret')
        response = self.client.get(reverse('profile', args=[self.user.username]))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'profiles/profile.html')

    def test_profile_view_post(self):
        self.client.login(username='testuser', password='secret')
        response = self.client.post(reverse('profile', args=[self.user.username]), {
            'username': 'testuser',
            'first_name': 'Updated',
            'last_name': 'User',
            'email': 'updateduser@example.com',
            'phone_number': '+380991111111',
        })
        self.assertEqual(response.status_code, 302)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user.profile.date_of_birth, date(2000, 1, 1))

    def test_add_profile_photo(self):
        self.client.login(username='testuser', password='secret')
        with tempfile.NamedTemporaryFile(suffix=".jpg") as tmp:
            tmp.write(b'a' * (1024 * 1024))  # 1MB file
            tmp.seek(0)
            response = self.client.post(reverse('add_profile_photo'), {'image': tmp})
            self.assertEqual(response.status_code, 200)
            self.assertIn('url', response.json()['photo'])
            self.assertIn('id', response.json()['photo'])

    def test_delete_profile_photo(self):
        self.client.login(username='testuser', password='secret')
        profile_photo = ProfilePhoto.objects.create(profile=self.user.profile,
                                                    image=SimpleUploadedFile("file.jpg", b"file_content"))

        response = self.client.post(reverse('delete_profile_photo', args=[profile_photo.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], "Photo successfully deleted")
        self.assertFalse(ProfilePhoto.objects.filter(pk=profile_photo.pk).exists())

    def test_delete_profile_photo_forbidden(self):
        other_user = User.objects.create_user(username='otheruser', password='secret')
        Profile.objects.create(user=other_user, date_of_birth=date(2000, 1, 1))
        profile_photo = ProfilePhoto.objects.create(profile=other_user.profile,
                                                    image=SimpleUploadedFile("file.jpg", b"file_content"))

        self.client.login(username='testuser', password='secret')
        response = self.client.post(reverse('delete_profile_photo', args=[profile_photo.pk]))
        self.assertEqual(response.status_code, 403)
