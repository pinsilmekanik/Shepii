export const formatText = {
    
    capitalizeEachWord: (text: string): string => {
      if (!text) return '';
      return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    },
  
    
    formatProductName: (name: string): string => {
      if (!name) return '';
      
      const isLowerCase = name === name.toLowerCase();
      if (isLowerCase) {
        return name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      return name; 
    },
  
    
    formatCategory: (category: string): string => {
      if (!category) return '';
      
      const isLowerCase = category === category.toLowerCase();
      if (isLowerCase) {
        return category
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      return category; 
    },
  
    
    toSlug: (text: string): string => {
      return text.toLowerCase().replace(/\s+/g, '-');
    }
  };