const JobCard = ({ job }) => {
    return (
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <p className="text-sm text-gray-500">{job.company}</p>
        <p className="mt-2 text-gray-700">{job.description}</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Apply Now
        </button>
      </div>
    );
  };
  
  export default JobCard;
  