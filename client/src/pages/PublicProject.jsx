import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getPublicProject
} from "../services/api";


function PublicProject() {

    const { slug } = useParams();

    const [project, setProject] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadProject = async () => {

            try {

                const data =
                    await getPublicProject(
                        slug
                    );

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


            <div className="success-box">

                This is a read-only public
                project page.

            </div>

        </div>
    );
}


export default PublicProject;