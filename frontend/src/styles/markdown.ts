export const markdownStyles = {
  '& h1': { 
    fontSize: '28px', 
    marginBottom: '16px', 
    borderBottom: '1px solid #e1e4e8', 
    paddingBottom: '8px' 
  },
  '& h2': { 
    fontSize: '24px', 
    marginBottom: '12px', 
    marginTop: '24px' 
  },
  '& h3': { 
    fontSize: '20px', 
    marginBottom: '8px', 
    marginTop: '20px' 
  },
  '& p': { 
    marginBottom: '16px' 
  },
  '& ol, & ul': { 
    marginBottom: '16px', 
    paddingLeft: '24px' 
  },
  '& li': { 
    marginBottom: '4px' 
  },
  '& code': { 
    backgroundColor: '#f6f8fa', 
    padding: '2px 4px', 
    borderRadius: '3px', 
    fontSize: '14px' 
  },
  '& pre': { 
    backgroundColor: '#f6f8fa', 
    padding: '16px', 
    borderRadius: '6px', 
    overflow: 'auto', 
    marginBottom: '16px' 
  },
  '& blockquote': { 
    borderLeft: '4px solid #dfe2e5', 
    paddingLeft: '16px', 
    color: '#6a737d', 
    marginBottom: '16px' 
  },
  '& video': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    margin: '8px 0',
    transition: 'opacity 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }
  }
}; 