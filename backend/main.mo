import Nat "mo:base/Nat";

import Time "mo:base/Time";
import Array "mo:base/Array";
import List "mo:base/List";
import Text "mo:base/Text";
import Int "mo:base/Int";

actor {
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Int;
  };

  stable var posts : List.List<Post> = List.nil();
  stable var nextId : Nat = 0;

  public func createPost(title: Text, body: Text, author: Text) : async Nat {
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := List.push(post, posts);
    nextId += 1;
    post.id
  };

  public query func getPosts() : async [Post] {
    List.toArray(List.reverse(posts))
  };
}
