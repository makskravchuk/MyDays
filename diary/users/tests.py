from datetime import date

from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse
from profiles.models import Profile

from .models import Friendship


class AuthenticationTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user_credentials = {
            'username': 'test_user',
            'password': 'secret'
        }
        self.user = User.objects.create_user(**self.user_credentials)
        Profile.objects.create(user=self.user, date_of_birth=date(2000, 1, 1))

    def test_login_view(self):
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'auth/login.html')

        response = self.client.post(reverse('login'), self.user_credentials)
        self.assertRedirects(response, reverse('home'))

    def test_logout_view(self):
        self.client.login(username='test_user', password='secret')
        response = self.client.get(reverse('logout'))
        self.assertRedirects(response, reverse('login'))

    def test_register_view(self):
        response = self.client.get(reverse('register'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'auth/register.html')

        user_form_data = {
            'username': 'new_user3',
            'password': 'new_secret123qwerty123',
            'password_confirm': 'new_secret123qwerty123',
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User'
        }
        profile_form_data = {
            'phone_number': '+380990000000',
            'date_of_birth': date(2000, 1, 1),
        }
        response = self.client.post(reverse('register'), {**user_form_data, **profile_form_data})
        self.assertEqual(response.status_code, 302)


class FriendshipTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='user1', password='secret1')
        Profile.objects.create(user=self.user1, date_of_birth=date(2000, 1, 1))
        self.user2 = User.objects.create_user(username='user2', password='secret2')
        Profile.objects.create(user=self.user2, date_of_birth=date(2000, 1, 1))
        self.client.login(username='user1', password='secret1')

    def test_send_friendship_request(self):
        response = self.client.post(reverse('send_friendship_request', args=[self.user2.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['friendshipStatus'], 'sent')

        friendship = Friendship.objects.get(from_user=self.user1, to_user=self.user2)
        self.assertEqual(friendship.status, Friendship.PENDING)

    def test_accept_friendship_request(self):
        Friendship.objects.create(from_user=self.user2, to_user=self.user1, status=Friendship.PENDING)
        response = self.client.post(reverse('accept_friendship', args=[self.user2.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['friendshipStatus'], Friendship.ACCEPTED)

        friendship = Friendship.objects.get(from_user=self.user2, to_user=self.user1)
        self.assertEqual(friendship.status, Friendship.ACCEPTED)

    def test_remove_friendship(self):
        Friendship.objects.create(from_user=self.user1, to_user=self.user2, status=Friendship.ACCEPTED)
        response = self.client.post(reverse('remove_friendship', args=[self.user2.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['friendshipStatus'], 'no_friendship')

        with self.assertRaises(Friendship.DoesNotExist):
            Friendship.objects.get(from_user=self.user1, to_user=self.user2)


class SearchTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='user1', password='secret1')
        Profile.objects.create(user=self.user1, date_of_birth=date(2000, 1, 1))
        self.user2 = User.objects.create_user(username='user2', password='secret2')
        Profile.objects.create(user=self.user2, date_of_birth=date(2000, 1, 1))
        self.client.login(username='user1', password='secret1')

    def test_search_for_people(self):
        response = self.client.get(reverse('search_people'), {'q': 'user2'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('user2', response.json()['people'][0]['user']['username'])
