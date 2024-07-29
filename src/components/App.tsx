import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import MessageBoard from './MessageBoard';
import { AllPosts } from './AllPosts';
import { PostView } from './Post';
import { Welcome } from './Welcome';
import { welcomeLoader } from '../utils/welcomeLoader';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <MessageBoard />,
        children: [
          {
            path: ':pageNumber',
            element: <AllPosts />,
          },
          {
            path: 'post/:postId',
            element: <PostView />,
          },
        ],
      },
      {
        path: 'welcome',
        element: <Welcome />,
        loader: welcomeLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
