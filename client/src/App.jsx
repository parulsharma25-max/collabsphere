import {
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectAnalytics from "./pages/ProjectAnalytics";
import PublicProject from "./pages/PublicProject";

import Notes from "./pages/Notes";
import AI from "./pages/AI";
import Files from "./pages/Files";

import "./App.css";


function App() {

    return (
        <>
            <Navbar />

            <main className="page">

                <Routes>


                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                            />
                        }
                    />



                    <Route
                        path="/login"
                        element={
                            <Login />
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <Register />
                        }
                    />

                    

                    <Route
                        path="/public/project/:slug"
                        element={
                            <PublicProject />
                        }
                    />



                    <Route
                        element={
                            <ProtectedRoute />
                        }
                    >



                        <Route
                            path="/dashboard"
                            element={
                                <Dashboard />
                            }
                        />



                        <Route
                            path="/projects"
                            element={
                                <Projects />
                            }
                        />


                        

                        <Route
                            path="/projects/:id"
                            element={
                                <ProjectDetails />
                            }
                        />



                        <Route
                            path="/projects/:id/analytics"
                            element={
                                <ProjectAnalytics />
                            }
                        />



                        <Route
                            path="/notes"
                            element={
                                <Notes />
                            }
                        />


                       

                        <Route
                            path="/files"
                            element={
                                <Files />
                            }
                        />


                        

                        <Route
                            path="/ai"
                            element={
                                <AI />
                            }
                        />

                    </Route>


                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                            />
                        }
                    />

                </Routes>

            </main>
        </>
    );
}


export default App;