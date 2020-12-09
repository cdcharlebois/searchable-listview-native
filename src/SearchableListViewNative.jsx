/*global mx*/
import { FlatList, View } from "react-native";
import { createElement, useEffect, useRef } from "react";
import { flattenStyles } from "./utils/common";
const defaultStyle = {
    container: {},
    // label: {},
    input: {}
};
export const SearchableListViewNative = ({ datasource, content, style, constraints }) => {
    const limit = useRef(20);
    const pid = useRef(null);
    useEffect(() => {
        datasource.setLimit(limit.current);
    }, []);
    useEffect(() => {
        if (datasource.status !== "available" && pid.current == null) {
            pid.current = mx.ui.showProgress("", true);
            console.debug(`SearchableListViewNative: Showing progress (${pid.current})`);
        } else {
            if (pid.current != null) {
                mx.ui.hideProgress(pid.current);
                console.debug(`SearchableListViewNative: Hiding progress (${pid.current})`);
                pid.current = null;
            }
        }
        return () => {
            if (pid.current != null) {
                mx.ui.hideProgress(pid.current);
                console.debug(`SearchableListViewNative: Hiding progress (${pid.current})`);
                pid.current = null;
            }
        };
    }, [datasource.status]);
    const styles = flattenStyles(defaultStyle, style);
    const applyFilters = item => constraints.every(constraint => constraint.expression(item).value);
    const filteredData = () => (datasource.items ? datasource.items.filter(item => applyFilters(item)) : []);
    const loadNextPage = () => {
        limit.current += 20;
        datasource.setLimit(limit.current);
    };

    // /**
    //  * Returns true if the constraint is matched.
    //  * @param {any} targetVal
    //  * @param {"contains" | "starts_with" | "equals"} operator
    //  * @param {any} sourceVal
    //  * TODO:
    //  * - use some intelligence to look at numeric types (greater than; equal; less than, etc)
    //  */
    // const applyConstraint = (targetVal, operator, sourceVal) => {
    //     // console.debug(`filtering on string Target[${targetVal}] Operator[${operator}] Source[${sourceVal}]`);
    //     if (!sourceVal) {
    //         // no filter specified -- pass everything
    //         return true;
    //     } else if (targetVal === undefined) {
    //         // target is empty -- fail everything
    //         return false;
    //     } else if (typeof targetVal !== typeof sourceVal) {
    //         // wrong entry in the widget config
    //         console.warn(
    //             `Tried comparing incompatible data types. (Target ${typeof targetVal} and Source ${typeof sourceVal})`
    //         );
    //         return false;
    //     } else if (targetVal instanceof Date) {
    //         // date attribute
    //         switch (operator) {
    //             case "equals":
    //                 return targetVal === sourceVal;
    //             case "greater_than":
    //                 return targetVal > sourceVal;
    //             case "greater_than_or_equal":
    //                 return targetVal >= sourceVal;
    //             case "less_than":
    //                 return targetVal < sourceVal;
    //             case "less_than_or_equal":
    //                 return targetVal <= sourceVal;
    //             default:
    //                 console.warn(`Invalid operator for date data type. Tried using "${operator}".`);
    //                 return false;
    //         }
    //     } else if (typeof targetVal === "string") {
    //         // string attributes
    //         if (sourceVal == "" || !sourceVal) {
    //             return true;
    //         }
    //         switch (operator) {
    //             case "contains":
    //                 return targetVal.toLowerCase().indexOf(sourceVal.toLowerCase()) > -1;
    //             case "starts_with":
    //                 return targetVal.toLowerCase().indexOf(sourceVal.toLowerCase()) === 0;
    //             case "equals":
    //                 return targetVal.toLowerCase() === sourceVal.toLowerCase();
    //             default:
    //                 console.warn(`Invalid operator for string data type. Tried using "${operator}".`);
    //                 return false;
    //         }
    //     } else if (typeof targetVal === "object") {
    //         // numeric (int or decimal or long)
    //         switch (operator) {
    //             case "equals":
    //                 return targetVal.eq(sourceVal);
    //             case "greater_than":
    //                 return targetVal.gt(sourceVal);
    //             case "greater_than_or_equal":
    //                 return targetVal.gte(sourceVal);
    //             case "less_than":
    //                 return targetVal.lt(sourceVal);
    //             case "less_than_or_equal":
    //                 return targetVal.lte(sourceVal);
    //             default:
    //                 console.warn(`Invalid operator for numeric data type. Tried using "${operator}".`);
    //                 return false;
    //         }
    //     }
    // };
    return datasource.items ? (
        <View style={styles.container}>
            <FlatList
                data={filteredData()}
                renderItem={({ item }) => content(item)}
                keyExtractor={item => item.id}
                onEndReachedThreshold={0.5}
                onEndReached={() => loadNextPage()}
            />
        </View>
    ) : null;
};
SearchableListViewNative.displayName = "FilterView";
