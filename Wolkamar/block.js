GetPropertyByDottedPath = function(Object,PathStr)
    {
      if(!Object)
      {
        console.error("Object not found");
        return null;
      }
      if(typeof(Object) !== typeof({}))
      {
        console.error("Input `Object` must be object");
        return null;
      }
      if(!PathStr || PathStr.length === undefined)
      {
        console.error("PathStr is not speciffied");
        return null;
      }
      const Path = PathStr.split(".");
      for(let i = 0; i < Path.length; i++)
      {
        if(!Object.hasOwnProperty(Path[i]))
        {
          console.error("Property is not found");
          return null;
        }
        Object = Object[Path[i]];
      }
      return Object;
    }