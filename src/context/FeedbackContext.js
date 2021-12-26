import { createContext, useState, useEffect } from "react";

const FeedbackContext = createContext()

export const FeedbackProvider = ({ children }) => {
    
    const [isLoading, setIsLoading] = useState(true)
    const [feedback, setFeedback] = useState([])

    useEffect(() => {
        fetchFeedback()
    }, [])
    
    const fetchFeedback = async () => {
        const response = await fetch(`/feedback?_sort=id&_order=desc`)
        const deta = await response.json()
        setFeedback(deta)
        setIsLoading(false)
    }

    const [feedbackEdit, setfeedbackEdit] = useState({
        item: {},
        edit: false
    })

    const editFeedback = (item) => {
        setfeedbackEdit({
            item,
            edit: true
        })
    }

    // delete feedback
    const deleteFeedback = async (id) => {
        if (window.confirm('Are you sure :)'))
        {
            await fetch(`/feedback/${id}`, { method: 'DELETE' })
            setFeedback(feedback.filter((item) => item.id !== id))
        }
    }

    // update Feedback
    const updateFeedback = async (id, updItem) => {

        const response = await fetch (`/feedback/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updItem),
        })
        const data = response.json()
        setFeedback(
            feedback.map((item) => (item.id === id ? {...item, ...data} : item))
        )
        fetchFeedback()
    }

    // ADD Feedback
    const addFeedback = async (newFeedback) => {
        
        const response = await fetch('/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFeedback),
        })
    
        const data = await response.json()

        setFeedback([data, ...feedback]);
   }

    return (
        <FeedbackContext.Provider
            value={{
                feedback,
                deleteFeedback,
                isLoading,
                addFeedback,
                editFeedback,
                feedbackEdit,
                updateFeedback,
            }}
        >
            {children}
        </FeedbackContext.Provider>
        )
}

export default FeedbackContext