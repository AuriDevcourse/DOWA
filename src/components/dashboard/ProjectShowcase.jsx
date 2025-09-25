import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Star, Clock } from "lucide-react";

export default function ProjectShowcase({ projects }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'in_progress': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-orange-400 bg-orange-400/20';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card rounded-3xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white text-glow">Recent Projects</h2>
        <button className="glass-morphism rounded-full px-4 py-2 text-white/80 hover:text-white text-sm font-medium glow-on-hover">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.slice(0, 4).map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="glass-morphism rounded-2xl p-4 glow-on-hover group"
            >
              <div className="flex items-start gap-4">
                <div className="glass-intense rounded-xl p-3 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white group-hover:text-glow transition-all duration-300">
                      {project.title}
                    </h3>
                    <div className={`glass-morphism rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </div>
                  </div>
                  
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {project.tech_stack?.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="glass-morphism rounded-full px-2 py-1 text-xs text-white/70">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-morphism rounded-full p-2 text-white/60 hover:text-white glow-on-hover"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-morphism rounded-full p-2 text-white/60 hover:text-white glow-on-hover"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="glass-morphism rounded-2xl p-8 text-center"
          >
            <Clock className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No Projects Yet</h3>
            <p className="text-white/60 text-sm mb-4">Start by creating your first project</p>
            <button className="glass-intense rounded-full px-4 py-2 text-white font-medium glow-on-hover">
              Create Project
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}