import { useState, useEffect } from 'react';
import './ContributionGraph.css';

const ContributionGraph = ({ username }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // We're using the contribution embed directly from GitHub
        // This is more reliable than using the API which has rate limits
        setLoading(false);
    }, [username]);

    if (loading) {
        return (
            <div className="contribution-graph-skeleton">
                <div className="animate-pulse bg-brown-light/20 h-40 w-full rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="contribution-graph-error">
                <p>Failed to load contribution data</p>
            </div>
        );
    }    return (
        <div className="contribution-graph rounded-lg overflow-hidden">
            <a 
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center"
            >
                <img 
                    src={`https://ghchart.rshah.org/${username}`} 
                    alt={`${username}'s GitHub Contribution Chart`}
                    className="w-full h-auto max-w-full"
                />
                <div className="py-1 px-2 text-xs text-brown-medium bg-brown-light/10 hover:bg-brown-light/20 transition-all">
                    View complete activity on GitHub
                </div>
            </a>
        </div>
    );
};

export default ContributionGraph;
