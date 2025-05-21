import { useEffect, useState } from 'react';
import axios from 'axios';
import CustomCard from './CustomCard';
import ContributionGraph from './ContributionGraph';
import { FaGithub, FaCodeBranch, FaStar, FaCode, FaFire } from 'react-icons/fa';
import { GoRepo } from 'react-icons/go';
import './GitHubStats.css';

const GitHubStats = ({ username }) => {
    const [stats, setStats] = useState({
        loading: true,
        error: false,
        user: null,
        repos: [],
        languages: {},
        totalStars: 0,
        totalForks: 0
    });    useEffect(() => {
        const fetchGitHubStats = async () => {
            if (!username) return;

            try {
                setStats(prev => ({ ...prev, loading: true, error: false }));
                
                // Fetch user data
                const userResponse = await axios.get(`https://api.github.com/users/${username}`);
                
                // Fetch repositories with error handling
                let repos = [];
                try {
                    const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
                    repos = reposResponse.data;
                } catch (repoError) {
                    console.error('Error fetching repositories:', repoError);
                    // Continue with empty repos array
                }
                
                // Process repository data
                let totalStars = 0;
                let totalForks = 0;
                let languages = {};
                
                repos.forEach(repo => {
                    totalStars += repo.stargazers_count;
                    totalForks += repo.forks_count;
                    
                    if (repo.language && !repo.fork) {
                        languages[repo.language] = (languages[repo.language] || 0) + 1;
                    }
                });
                
                // Sort languages by usage
                const sortedLanguages = Object.entries(languages)
                    .sort((a, b) => b[1] - a[1])
                    .reduce((obj, [key, value]) => {
                        obj[key] = value;
                        return obj;
                    }, {});
                
                setStats({
                    loading: false,
                    error: false,
                    user: userResponse.data,
                    repos,
                    languages: sortedLanguages,
                    totalStars,
                    totalForks
                });
            } catch (error) {
                console.error('Error fetching GitHub stats:', error);
                setStats(prev => ({ 
                    ...prev, 
                    loading: false, 
                    error: true,
                    errorMessage: error.message 
                }));
            }
        };
        
        fetchGitHubStats();
    }, [username]);
    
    if (stats.loading) {
        return (
            <CustomCard className="flex flex-col p-4">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4">
                    {[1, 2].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="h-3 bg-brown-light/30 rounded w-1/3 mb-2"></div>
                            <div className="h-32 bg-brown-light/10 rounded"></div>
                        </div>
                    ))}
                </div>
                <div className="animate-pulse">
                    <div className="h-3 bg-brown-light/30 rounded w-1/3 mb-2"></div>
                    <div className="h-36 bg-brown-light/10 rounded"></div>
                </div>
            </CustomCard>
        );
    }if (stats.error) {
        return (
            <CustomCard className="flex flex-col p-4">
                <p className="text-xs text-center text-brown-medium/70 mb-2">
                    API limit exceeded. Using fallback stats.
                </p>
                
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4">                    
                    {/* GitHub Stats Card */}
                    <div>
                        <h4 className="text-sm font-bold text-brown-dark mb-2 flex items-center gap-1">
                            <FaGithub className="text-sm" /> GitHub Stats
                        </h4>
                        <div className="github-readme-stats-container">
                            <img 
                                src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&count_private=true&theme=gruvbox&hide_border=true&bg_color=fffaf3&title_color=85644e&icon_color=85644e&text_color=85644e&border_radius=10&hide=&include_all_commits=true&line_height=30&card_width=350`}
                                alt="GitHub Stats"
                                className="w-full h-auto github-stats-img"
                            />
                        </div>
                    </div>
                    
                    {/* GitHub Streak Stats */}
                    <div>
                        <h4 className="text-sm font-bold text-brown-dark mb-2 flex items-center gap-1">
                            <FaFire className="text-sm" /> Contribution Streak
                        </h4>
                        <div className="github-readme-stats-container">
                            <img 
                                src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=gruvbox&hide_border=true&background=fffaf3&ring=85644e&fire=85644e&currStreakLabel=85644e&border=85644e&stroke=85644e&sideLabels=85644e&dates=85644e&currStreakNum=85644e&border_radius=10&card_width=350`}
                                alt="GitHub Streak Stats"
                                className="w-full h-auto github-stats-img"
                            />
                        </div>
                    </div>
                </div>
                
                {/* GitHub Contribution Graph - Full Width */}
                <div>
                    <h4 className="text-sm font-bold text-brown-dark mb-2 flex items-center gap-1">
                        <FaCode className="text-sm" /> Contribution Activity
                    </h4>
                    <ContributionGraph username={username} />
                </div>
            </CustomCard>
        );
    }

    if (!stats.user) {
        return null;
    }   
    
    return (
        <CustomCard className="flex flex-col p-4 hover:shadow-lg transition-all duration-300 github-stats-card">            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4">
                {/* GitHub Stats Card */}
                <div>
                    <h4 className="text-sm font-bold text-brown-dark mb-2 flex items-center gap-1">
                        <FaGithub className="text-sm" /> GitHub Stats
                    </h4>
                    <div className="github-readme-stats-container">
                        <img 
                            src={`https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&count_private=true&theme=gruvbox&hide_border=true&bg_color=fffaf3&title_color=85644e&icon_color=85644e&text_color=85644e&border_radius=10&include_all_commits=true&line_height=28&custom_title=GitHub%20Activity`}
                            alt="GitHub Stats"
                            className="github-stats-img"
                        />
                    </div>
                </div>
                
                {/* GitHub Streak Stats */}
                <div>
                    <h4 className="text-sm font-bold text-brown-dark mb-2 flex items-center gap-1">
                        <FaFire className="text-sm" /> Contribution Streak
                    </h4>
                    <div className="github-readme-stats-container">
                        <img 
                            src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=gruvbox&hide_border=true&background=fffaf3&ring=85644e&fire=85644e&currStreakLabel=85644e&border=85644e&stroke=85644e&sideLabels=85644e&dates=85644e&currStreakNum=85644e&border_radius=10`}
                            alt="GitHub Streak Stats"
                            className="github-stats-img"
                        />
                    </div>
                </div>
            </div>
            
            {/* GitHub Contribution Graph - Full Width */}
            <div>
                <h4 className="text-sm font-bold text-brown-dark mb-2 flex items-center gap-1">
                    <FaCode className="text-sm" /> Contribution Activity
                </h4>
                <ContributionGraph username={username} />
            </div>
        </CustomCard>
    );
};

export default GitHubStats;
