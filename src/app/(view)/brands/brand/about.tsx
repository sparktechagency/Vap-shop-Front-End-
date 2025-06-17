import React from "react";

const aboutData = [
  {
    title: "WHO ARE WE?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nisi odio, auctor sed efficitur a, volutpat a orci. Etiam mollis mi eget ipsum consequat, vitae aliquam dolor hendrerit. Nulla facilisi. Quisque ut risus sed massa placerat mollis ut et augue. Proin volutpat viverra sapien, id euismod ipsum consectetur vitae. Praesent sodales lacus suscipit posuere facilisis. Maecenas tortor purus, lobortis sed posuere ut, auctor eleifend lacus. Donec vitae condimentum neque. In in mollis purus. Sed accumsan porta magna, id porta mi tempus sed. Etiam sed quam at urna molestie posuere ut quis diam. Duis mattis ornare fermentum. Sed eget metus massa. Suspendisse non leo sit amet nisi vestibulum vestibulum. Sed sit amet molestie velit. Nam et ultricies augue.",
  },
  {
    title: "OUR MISSION",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nisi odio, auctor sed efficitur a, volutpat a orci. Etiam mollis mi eget ipsum consequat, vitae aliquam dolor hendrerit. Nulla facilisi. Quisque ut risus sed massa placerat mollis ut et augue. Proin volutpat viverra sapien, id euismod ipsum consectetur vitae. Praesent sodales lacus suscipit posuere facilisis. Maecenas tortor purus, lobortis sed posuere ut, auctor eleifend lacus. Donec vitae condimentum neque. In in mollis purus. Sed accumsan porta magna, id porta mi tempus sed. Etiam sed quam at urna molestie posuere ut quis diam. Duis mattis ornare fermentum. Sed eget metus massa. Suspendisse non leo sit amet nisi vestibulum vestibulum. Sed sit amet molestie velit. Nam et ultricies augue.
Suspendisse consectetur at neque sit amet vestibulum. Quisque non tortor in arcu bibendum facilisis ut eu tortor. Nulla ac risus ut lectus bibendum sagittis. Proin felis ipsum, ultrices at blandit eu, gravida quis leo. Etiam in porttitor arcu. Vivamus ac ullamcorper nisi. Quisque gravida, ipsum ac vehicula aliquam, ex enim feugiat leo, ac suscipit lorem metus at sapien. Donec ac elementum nibh, a fermentum lacus. Praesent et metus elit.`,
  },
  {
    title: "WHY SMOK?",
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In nisi odio, auctor sed efficitur a, volutpat a orci. Etiam mollis mi eget ipsum consequat, vitae aliquam dolor hendrerit. Nulla facilisi. Quisque ut risus sed massa placerat mollis ut et augue. Proin volutpat viverra sapien, id euismod ipsum consectetur vitae. Praesent sodales lacus suscipit posuere facilisis. Maecenas tortor purus, lobortis sed posuere ut, auctor eleifend lacus. Donec vitae condimentum neque. In in mollis purus. Sed accumsan porta magna, id porta mi tempus sed. Etiam sed quam at urna molestie posuere ut quis diam. Duis mattis ornare fermentum. Sed eget metus massa. Suspendisse non leo sit amet nisi vestibulum vestibulum. Sed sit amet molestie velit. Nam et ultricies augue.
Suspendisse consectetur at neque sit amet vestibulum. Quisque non tortor in arcu bibendum facilisis ut eu tortor. Nulla ac risus ut lectus bibendum sagittis. Proin felis ipsum, ultrices at blandit eu, gravida quis leo. Etiam in porttitor arcu. Vivamus ac ullamcorper nisi. Quisque gravida, ipsum ac vehicula aliquam, ex enim feugiat leo, ac suscipit lorem metus at sapien. Donec ac elementum nibh, a fermentum lacus. Praesent et metus elit.`,
  },
];

export default function About() {
  return (
    <div className="!my-12 !space-y-8">
      {aboutData.map((x, i) => (
        <div key={i}>
          <h1 className="!mb-4 text-4xl font-semibold">{x.title}</h1>
          <p>{x.description}</p>
        </div>
      ))}
    </div>
  );
}
