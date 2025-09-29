


export function createPageUrl(pageName: string) {
    // Handle specific page name mappings
    const pageMap: { [key: string]: string } = {
        'DepartmentTimeline': '/department-timeline',
        'ProcessImport': '/processimport',
        'AddEvent': '/addevent',
        'Departments': '/departments',
        'Settings': '/settings'
    };
    
    return pageMap[pageName] || ('/' + pageName.toLowerCase().replace(/ /g, '-'));
}