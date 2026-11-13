
import { Sparkles } from "lucide-react";

function Recommendations() {
  return (
    <div className="page-container">
      <h1>Style Recommendations ✨</h1>
      <p>Discover outfit ideas for different occasions.</p>
      <div className="page-card">
        <Sparkles size={40} />
        <h2>Your style journey starts here!</h2>
        <p>Personalized outfit recommendations will be added soon.</p>
      </div>
    </div>
  );
}

export default Recommendations;
