import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import api from '../api/axios';
import { useUserLocation } from '../hooks/useUserLocation';

const CATEGORIES = ['mason', 'plumber', 'carpenter', 'helper', 'electrician', 'construction'];

function PostJob() {
    const navigate = useNavigate();
    const [form, setform] = useState({
        title: "",
        category: "",
        wagesPerDay: "",
        workersNeeded: "",
        durationDays: "",
        employerName: "",
        phone: "",
        address: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/jobs/create", form);
            alert("Job Created Successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error in Adding Job");
        }
    }

    const labelMap = {
        title: "Job Title",
        category: "Category",
        wagesPerDay: "Price (₹ / $)",
        workersNeeded: "Total Workers",
        durationDays: "Total Working Days",
        employerName: "Employer Name",
        phone: "Phone",
        address: "Address",
        location: "Location"
    };

    return (
        <div>
            <h2><strong>Post a Job</strong></h2>
            <form onSubmit={handleSubmit}>
                {Object.keys(form).map((key) => {
                    return (
                        <div key={key}>
                            <label htmlFor={key}>{labelMap[key]}</label>
                            <input
                                id={key}
                                name={key}
                                value={form[key]}
                                onChange={handleChange}
                                type={
                                    key === 'wagesPerDay' || key === 'workersNeeded' || key === 'durationDays'
                                        ? 'number'
                                        : 'text'
                                }
                                placeholder={`Enter ${labelMap[key]}`}
                            />
                        </div>
                    );
                })}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default PostJob