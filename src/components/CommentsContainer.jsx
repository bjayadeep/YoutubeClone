import React from "react";

// Dummy data for comments to test nested rendering
const commentsData = [
  {
    name: "Jayadeep",
    text: "This is the first comment.",
    replies: [
      {
        name: "Roomie 1",
        text: "Indeed. Very Good.",
        replies: [],
      },
      {
        name: "Roomie 2",
        text: "I agree with you Roomie.",
        replies: [
          {
            name: "Opposite Room Roomie 1",
            text: "Building n-dimension comments is very good",
            replies: [
                {
                    name: "Opposite Room Roomie 2",
                    text: "Yeah it is cool unlike Youtube comments which only has 2-D.",
                    replies:[],
                },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Youtube User",
    text: "Great video quality!",
    replies: [
      {
        name: "",
        text: "Learning so much from this channel.",
        replies: [],
      },
    ],
  },
  {
    name: "Guest",
    text: "Also loved your NetflixGPT",
    replies: [],
  },
];

const Comment = ({ data }) => {
  const { name, text } = data; 
  return (
    <div className="flex shadow-sm bg-gray-100 p-2 rounded-2xl my-2"> 
      <img
        className="w-8 h-8 rounded-full mr-3" 
        alt="comment-user-icon"
        src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png" 
      />
      <div className="px-3">
        <p className="font-bold text-sm">{name}</p> 
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
};

const CommentsList = ({ comments }) => {
  return comments.map((comment, index) => (
    <div key={index}> 
      <Comment data={comment} /> 
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-5 border-l border-gray-300 ml-5"> 
          <CommentsList comments={comment.replies} />
        </div>
      )}
    </div>
  ));
};


const CommentsContainer = () => {
  return (
    <div className="m-5 p-2">
      <h1 className="text-2xl font-bold mb-4">Comments:</h1> 
      <CommentsList comments={commentsData} /> 
    </div>
  );
};

export default CommentsContainer;
