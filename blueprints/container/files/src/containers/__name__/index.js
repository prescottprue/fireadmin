import <%= pascalEntityName %> from './<%= pascalEntityName %>';
import enhancer from './<%= pascalEntityName %>.enhancer'

export { enhancer, <%= pascalEntityName %> as component }

export default enhancer(<%= pascalEntityName %>);
