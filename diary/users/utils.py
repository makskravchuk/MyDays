from .models import Friendship
from django.db.models import Q


def get_friends(user, limit=100000):
    friendships = Friendship.objects.filter(Q(from_user=user, status=Friendship.ACCEPTED) | Q(to_user=user, status=Friendship.ACCEPTED))[
                  :limit]
    friends = []
    for friendship in friendships:
        if friendship.from_user == user:
            friends.append(friendship.to_user)
        else:
            friends.append(friendship.from_user)
    return friends

def get_friends_friendship_status(request_user, user):
    friendships = Friendship.objects.filter(Q(from_user=user,status=Friendship.ACCEPTED) | Q(to_user=user,status=Friendship.ACCEPTED))
    friends = []
    for friendship in friendships:
        if friendship.from_user == user:
            friends.append((friendship.to_user,get_friendship_status(request_user,friendship.to_user)))
        else:
            friends.append((friendship.from_user,get_friendship_status(request_user,friendship.from_user)))
    return friends

def get_friend_requests(user):
    friend_requests = user.friendships_received.filter(status=Friendship.PENDING)
    users = []
    for friend_request in friend_requests:
        users.append((friend_request.from_user,friend_request.status))
    return users


def are_friends(user1, user2):
    return Friendship.objects.filter(
        (Q(from_user=user1, to_user=user2, status=Friendship.ACCEPTED)) |
        (Q(from_user=user2, to_user=user1, status=Friendship.ACCEPTED))
    ).exists()


def not_user_and_friends(user, request_user):
    return user != request_user and not are_friends(user, request_user)


def get_friendship_status(from_user, to_user):
    friendship = Friendship.objects.filter(
        Q(from_user=from_user, to_user=to_user) | Q(from_user=to_user, to_user=from_user)).first()
    if friendship:
        if friendship.from_user == from_user and friendship.status == Friendship.PENDING:
            return 'sent'
        return friendship.status
    else:
        return 'no_friendship'
