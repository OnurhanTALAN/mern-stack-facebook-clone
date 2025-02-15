import { useNavigate } from "react-router-dom"

const ConstructionIcon = () => (
  <div className="mx-auto mb-4 h-16 w-16 text-yellow-500 border-4 border-current rounded-full flex items-center justify-center">
    <span className="text-2xl font-bold">!</span>
  </div>
)

export default function ConstructionPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <div className="rounded-lg bg-white p-8 shadow-md">
        <ConstructionIcon />
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Under Construction</h1>
        <p className="mb-6 text-gray-600">We're working hard to bring you this page. Please check back soon!</p>
        <button onClick={() => navigate(-1)}>
          <span className="bg-black px-4 py-2 text-white rounded-md font-semibold">Go Back</span>
        </button>
      </div>
    </div>
  )
}

