import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getProjectById,
    addMember
} from "../services/api";


function ProjectDetails() {

    const { id } = useParams();

    const navigate = useNavigate();



    const [project, setProject] = useState(null);

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    const loadProject = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getProjectById(id);

            setProject(
                data.project
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }
    };



    useEffect(() => {

        loadProject();

    }, [id]);



    const handleAddMember = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");


        if (!email.trim()) {

            setError(
                "Please enter user email"
            );

            return;
        }


        try {

            const data =
                await addMember(
                    id,
                    email
                );


            setMessage(
                data.message ||
                "Member added successfully"
            );


            setEmail("");


            await loadProject();

        } catch (error) {

            setError(
                error.message
            );

        }
    };



    if (loading) {

        return (
            <div className="content-page">

                <div className="panel">

                    <p>
                        Loading project...
                    </p>

                </div>

            </div>
        );
    }



    if (!project) {

        return (
            <div className="content-page">

                <div className="panel">

                    <h2>
                        Project Not Found
                    </h2>

                    <p>
                        {error ||
                            "Unable to load project."}
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                "/projects"
                            )
                        }
                    >
                        Back to Projects
                    </button>

                </div>

            </div>
        );
    }



    return (
        <div className="content-page">



            <div className="section-heading">

                <p className="eyebrow">
                    PROJECT
                </p>

                <h1>
                    {project.name}
                </h1>

                <p>
                    {project.description}
                </p>

            </div>



            {message && (

                <div className="success-box">
                    {message}
                </div>

            )}


            {error && (

                <div className="error-box">
                    {error}
                </div>

            )}


            <div className="project-details-grid">



                <div className="panel">

                    <h2>
                        Project Overview
                    </h2>

                    <p>
                        <strong>
                            Name:
                        </strong>{" "}
                        {project.name}
                    </p>

                    <p>
                        <strong>
                            Description:
                        </strong>{" "}
                        {project.description}
                    </p>

                    <p>
                        <strong>
                            Project ID:
                        </strong>{" "}
                        {project._id}
                    </p>

                </div>


                <div className="panel">

                    <h2>
                        Project Owner
                    </h2>

                    {project.owner ? (

                        <>
                            <p>
                                <strong>
                                    Name:
                                </strong>{" "}
                                {project.owner.name}
                            </p>

                            <p>
                                <strong>
                                    Email:
                                </strong>{" "}
                                {project.owner.email}
                            </p>
                        </>

                    ) : (

                        <p>
                            Owner information
                            not available.
                        </p>

                    )}

                </div>


                <div className="panel">

                    <h2>
                        Members
                    </h2>

                    {project.members &&
                    project.members.length > 0 ? (

                        <div className="member-list">

                            {project.members.map(
                                (member) => (

                                    <div
                                        className="member-card"
                                        key={member._id}
                                    >

                                        <h3>
                                            {member.name}
                                        </h3>

                                        <p>
                                            {member.email}
                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <p>
                            No members found.
                        </p>

                    )}

                </div>



                <div className="panel">

                    <h2>
                        Add Member
                    </h2>

                    <p>
                        Add an existing user
                        using their email.
                    </p>

                    <form
                        onSubmit={
                            handleAddMember
                        }
                    >

                        <label>
                            Member Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            placeholder="user@example.com"
                            required
                        />

                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            Add Member
                        </button>

                    </form>

                </div>



                <div className="panel">

                    <h2>
                        Notes
                    </h2>

                    <p>
                        Create, edit and manage
                        notes for this project.
                    </p>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                `/notes?projectId=${id}`
                            )
                        }
                    >
                        View Notes
                    </button>

                </div>


                <div className="panel">

                    <h2>
                        Files
                    </h2>

                    <p>
                        Upload and manage files
                        for this project.
                    </p>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                `/files?projectId=${id}`
                            )
                        }
                    >
                        View Files
                    </button>

                </div>



                <div className="panel">

                    <h2>
                        Analytics
                    </h2>

                    <p>
                        View project members,
                        notes, files and
                        activity statistics.
                    </p>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                `/projects/${id}/analytics`
                            )
                        }
                    >
                        View Analytics
                    </button>

                </div>


                <div className="panel">

                    <h2>
                        Public Share
                    </h2>

                    <p>
                        Create a read-only
                        public project link.
                    </p>

                    <button
                        type="button"
                        className="primary-btn"
                        onClick={() =>
                            setMessage(
                                "Public sharing will be added next."
                            )
                        }
                    >
                        Make Project Public
                    </button>

                </div>


            </div>


           

            <div
                style={{
                    marginTop: "20px"
                }}
            >

                <button
                    className="primary-btn"
                    onClick={() =>
                        navigate(
                            "/projects"
                        )
                    }
                >
                    ← Back to Projects
                </button>

            </div>

        </div>
    );
}


export default ProjectDetails;