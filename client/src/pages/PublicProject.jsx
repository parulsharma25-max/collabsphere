import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getPublicProject,
    getNotes
} from "../services/api";


function PublicProject() {

    const { slug } = useParams();

    const [project, setProject] =
        useState(null);

    const [notes, setNotes] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadProject = async () => {

            try {

                const data =
                    await getPublicProject(slug);

                const projectData =
                    data.project;

                setProject(projectData);


                /*
                 Get project notes
                */

                try {

                    const notesData =
                        await getNotes(
                            projectData._id
                        );

                    setNotes(
                        notesData.notes ||
                        notesData ||
                        []
                    );

                } catch (noteError) {

                    console.log(
                        "Notes could not be loaded:",
                        noteError.message
                    );

                }

            } catch (error) {

                setError(
                    error.message
                );

            } finally {

                setLoading(false);
            }
        };


        loadProject();

    }, [slug]);


    if (loading) {

        return (
            <div className="content-page">

                <div className="panel">

                    <h2>
                        Loading...
                    </h2>

                </div>

            </div>
        );
    }


    if (error || !project) {

        return (
            <div className="content-page">

                <div className="panel">

                    <h2>
                        Public Project Not Found
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="content-page">


            <div className="section-heading">

                <p className="eyebrow">
                    PUBLIC PROJECT
                </p>

                <h1>
                    {project.name}
                </h1>

                <p>
                    {project.description}
                </p>

            </div>


            {/* Project Information */}

            <div className="panel">

                <h2>
                    Project Information
                </h2>

                <p>
                    <strong>
                        Owner:
                    </strong>{" "}
                    {project.owner?.name}
                </p>

                <p>
                    <strong>
                        Members:
                    </strong>{" "}
                    {project.members?.length || 0}
                </p>

            </div>


            {/* Members */}

            <div className="panel">

                <h2>
                    Members
                </h2>

                {project.members?.map(
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


            {/* README / Notes */}

            <div className="panel">

                <h2>
                    README / Project Notes
                </h2>

                {notes.length === 0 ? (

                    <p>
                        No public notes available
                        for this project.
                    </p>

                ) : (

                    notes.map((note) => (

                        <div
                            key={note._id}
                            className="panel"
                            style={{
                                marginTop: "15px"
                            }}
                        >

                            <h3>
                                {note.title}
                            </h3>

                            <div
                                style={{
                                    whiteSpace:
                                        "pre-wrap",
                                    lineHeight: "1.7"
                                }}
                            >
                                {note.content}
                            </div>

                        </div>

                    ))

                )}

            </div>


            <div className="success-box">

                This is a read-only public
                project page.

            </div>

        </div>
    );
}


export default PublicProject;