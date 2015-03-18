/**************** Weird inheritance ********************/
function extend(parent, child) {
  /**
   * Nest the functions of a child inside its parent
   * (parent methods get called first),
   * mix the properties of the child and the parent,
   * and patch these into the constructor
   */
  function nest(constructor, parent, child) {
    for (var key in child) {
      if (child.hasOwnProperty(key)) {
        constructor[key] = child[key];
      }
    }

    for (key in parent) {
      if (parent.hasOwnProperty(key)) {
        if(typeof parent[key] === 'function') {
          constructor[key] = function() {
            // Call base method first, then the derived method
            parent[key].apply(this, arguments);
            if(child[key]) child[key].apply(this, arguments);
          };
        } else {
          // fall back to parent property
          constructor[key] = child[key] || parent[key];
        }
      }
    }
  }

  // The new extended class
  var constructor = function() {
    // Call parent constructor first, then child constructor
    parent.apply(this, arguments);
    child.apply(this, arguments);
  };

  // The weird nesting behavior. ES6 cries.
  nest(constructor, parent, child);
  nest(constructor.prototype, parent.prototype, child.prototype);

  return constructor;
}

/****** Base class definition ********/
function Base(instanceVariable) {
  this.instanceVariable = instanceVariable;
}

Base.staticVariable = 'Base';
Base.staticMethod = function() {
  console.log("This is from Base class static-method, static-variable is: " + this.staticVariable);
};

Base.prototype.instanceMethod = function() {
  console.log("This is from Base class instance-method, instance-variable is: " + this.instanceVariable);
};

/****** Derived class definition ********/
function Derived(instanceVariable) {
  this.instanceVariable = instanceVariable;
}

Derived.staticVariable = 'Derived';
Derived.staticMethod = function() {
  console.log("This is from Derived class static-method, static-variable is: " + this.staticVariable);
};

Derived.prototype.instanceMethod = function() {
  console.log("This is from Derived class instance-method, instance-variable is: " + this.instanceVariable);
};

/****** Check behavior *****/
Derived = extend(Base, Derived);

example = new Derived('example');
Derived.staticMethod();
example.instanceMethod();
