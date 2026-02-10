// Sidebar Toggle Functionality
class SidebarManager {
    constructor() {
        this.sidebar = document.querySelector('.sidebar');
        this.toggleBtn = document.getElementById('sidebar-toggle');
        this.isCollapsed = this.loadState();
        
        this.init();
    }

    init() {
        // Apply saved state
        if (this.isCollapsed) {
            this.sidebar.classList.add('collapsed');
        }

        // Attach event listener
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }

        // Handle keyboard shortcut (Ctrl+B or Cmd+B)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    toggle() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.sidebar.classList.add('collapsed');
        } else {
            this.sidebar.classList.remove('collapsed');
        }

        // Save state
        this.saveState();

        // Dispatch event for other components (like chatbot) to adjust
        window.dispatchEvent(new CustomEvent('sidebar-toggle', {
            detail: { collapsed: this.isCollapsed }
        }));
    }

    saveState() {
        localStorage.setItem('sidebarCollapsed', this.isCollapsed);
    }

    loadState() {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
});
