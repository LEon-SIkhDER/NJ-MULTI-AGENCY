import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";

const PitchersDetails = () => {
    const { id } = useParams()
    const { data: pitcher } = useQuery({
        queryKey: ['pitcher', id],
        queryFn: async () => {
            const { data: result } = await axios.get(`http://localhost:5000/pitcher/${id}`)
            return result
        }
    })
    console.log(pitcher)

    return (
        <div>

        </div>
    );
};

export default PitchersDetails;