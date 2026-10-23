import { createBrowserRouter, RouterProvider } from "react-router"
import Layout from "./Layout"
import Home from "./pages/Home"
import PostJob from "./pages/PostJob"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/post-job",
                element: <PostJob/>
            }
        ]
    },
])

export default function App() {
    return <RouterProvider router={router} />
} 