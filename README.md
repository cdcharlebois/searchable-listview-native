### Further research

It would be great to have a widget that renders a listview which can be filtered by accepting context attributes, and
using those to filter the displayed items.

For instance, a widget that has a datasource of `Person(Name::string, Age::int, EyeColor::Enum[Green|Blue|Brown])`. This
widget could be configured with the following:

-   Attribute (or Expression) properties connected to the datasource entity, `Person` --> "Search Fields"
-   Attribute properties connected to the context entity --> "Search Values"
-   A link connecting each Search Value to a Search Field --> Criterion

Then, the widget could retrieve the full datasource, and do a `.filter()` operation for each Criterion, thereby reducing
the items finally rendered.

For instance:

```js
const Filterer = ({ datasource, criteria }) => {
    // criteria=[{<ds_attribute>, <ctx_attribute>}]
    const result = [];
    criteria.forEach(criterion => {
        //apply this filter to the datasource array, add the matching records to `result`
    });
    return result.map(`to some rendering`);
};
```
