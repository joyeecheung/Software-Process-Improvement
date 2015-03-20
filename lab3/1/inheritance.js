/**************** Weird inheritance ********************/
function extend(base, derived) {
  /**
   * Nest the functions of a derived inside its base
   * (base methods get called first),
   * mix the properties of the derived and the base,
   * and patch these into the constructor
   */
  function nest(constructor, base, derived) {
    for (var key in derived) {
      if (derived.hasOwnProperty(key)) {
        constructor[key] = derived[key];
      }
    }

    for (key in base) {
      if (base.hasOwnProperty(key)) {
        if (typeof base[key] === 'function') {
          constructor[key] = function() {
            // Call base method first, then the derived method
            base[key].apply(this, arguments);
            if (derived[key]) derived[key].apply(this, arguments);
          };
        } else {
          // fall back to base property
          constructor[key] = derived[key] || base[key];
        }
      }
    }
  }

  // The new extended class
  var constructor = function() {
    // Call base constructor first, then derived constructor
    base.apply(this, arguments);
    derived.apply(this, arguments);
  };

  // The weird nesting behavior. ES6 cries.
  nest(constructor, base, derived);
  nest(constructor.prototype, base.prototype, derived.prototype);

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
console.log("1 ------------------");

Derived = extend(Base, Derived);
example = new Derived('example');
Derived.staticMethod();
example.instanceMethod();

console.log("2 ------------------");

example = new Derived('example');
otherExample = new Derived('other-example');
Derived.staticMethod();
example.instanceMethod();
otherExample.instanceMethod();
