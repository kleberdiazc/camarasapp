import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.page.html',
  styleUrls: [
    './styles/user-friends.page.scss',
    './styles/user-friends.shell.scss',
    './styles/user-friends.ios.scss',
    './styles/user-friends.md.scss'
  ]
})
export class UserFriendsPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;

  data: any;

  segmentValue = 'friends';
  friendsList: Array<any>;
  followersList: Array<any>;
  followingList: Array<any>;
  searchQuery = '';
  showFilters = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      this.data = routeData['data'];
      this.friendsList = this.data.friends;
      this.followersList = this.data.followers;
      this.followingList = this.data.following;
    }, (error) => console.log(error));
  }

  segmentChanged(ev): void {
    this.segmentValue = ev.detail.value;

    // Check if there's any filter and apply it
    this.searchList();
  }

  searchList(): void {
    const query = (this.searchQuery && this.searchQuery !== null) ? this.searchQuery : '';

    if (this.segmentValue === 'friends') {
      this.friendsList = this.filterList(this.data.friends, query);
    } else if (this.segmentValue === 'followers') {
      this.followersList = this.filterList(this.data.followers, query);
    } else if (this.segmentValue === 'following') {
      this.followingList = this.filterList(this.data.following, query);
    }
  }

  filterList(list, query): Array<any> {
    return list.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  }

}
