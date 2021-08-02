![image-20201211102634539](https://github.com/cdcharlebois/searchable-listview-native/raw/main/README.assets/image-20201211102634539.png)

# Filter View

This widget is the spiritual successor to GridSearch, and adds the ability to configure advanced filtering controls to
listviews on native.

### ⚠️ This widget is only for use in Mendix 8. In Mendix 9, filter nanoflows can be used to achieve the same functionality with out-of-the-box components.

### Features

-   Implement configurable filtering on a listview on Native
-   Model your own filter inputs (using any combination of widgets/nanoflows/attributes)
-   Use those inputs to define dynamic filter constraints via expressions
-   Apply filters to any datasource (database or nanoflow)

### Implementation

Model your own filters, how/where-ever you need!

![image-20201209104841662](https://raw.githubusercontent.com/cdcharlebois/searchable-listview-native/main/README.assets/image-20201209104841662.png)

Configure the filters via expressions (connecting your filter inputs to datasource attributes)

![image-20201209105028733](https://github.com/cdcharlebois/searchable-listview-native/raw/main/README.assets/image-20201209105028733.png)

:tada:

![image-20201209105522954](https://github.com/cdcharlebois/searchable-listview-native/raw/main/README.assets/image-20201209105522954.png)

### TODO:

-   Add support for numeric filter types => added Big.js comparison operators and GT/GTE/LT/LTE numeric operators ✅
-   Change the constraints to be "AND"ed => changed `constraints.some()` to `constraints.every()` ✅
-   Remove the filterContent placeholder => removed ✅
-   Add support for datetime types => added `instanceof Date` type for attribute type, and comparison operators ✅
-   Expressions as constraints(?) 🤯 => changed all constraints to be expressions ✅
-   Allow one source value to be searched in multiple target attributes(?) => you can just do this in an expression with
    `or` ✅
-   Rename something more awesome. => **Filter View** ✅
