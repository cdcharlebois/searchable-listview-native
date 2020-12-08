import { Component, createElement, useEffect, useRef } from "react";
import { View, FlatList } from "react-native";
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
    const filteredData = () => {
        return datasource.items ? datasource.items.filter(item => applyFilters(item)) : [];
    };
    const loadNextPage = () => {
        limit.current += 20;
        datasource.setLimit(limit.current);
    };
    const applyFilters = item => {
        // return true if any of the item's filter Attributes match the value of searchTerm...
        return constraints.every(constraint => {
            return constraint.target(item).value
                ? applyConstraint(constraint.target(item).value, constraint.operator, constraint.source.value)
                : false;
        });
    };
    /**
     * Returns true if the constraint is matched.
     * @param {any} targetVal
     * @param {"contains" | "starts_with" | "equals"} operator
     * @param {any} sourceVal
     * TODO:
     * - use some intelligence to look at numeric types (greater than; equal; less than, etc)
     */
    const applyConstraint = (targetVal, operator, sourceVal) => {
        // debugger;
        if (!targetVal || !sourceVal) {
            return false;
        } else if (typeof targetVal !== typeof sourceVal) {
            console.warn(
                `Tried comparing incompatible data types. (Target ${typeof targetVal} and Source ${typeof sourceVal})`
            );
            return false;
        } else if (typeof targetVal === "string") {
            // string attributes
            switch (operator) {
                case "contains":
                    return targetVal.toLowerCase().indexOf(sourceVal.toLowerCase()) > -1;
                case "starts_with":
                    return targetVal.toLowerCase().indexOf(sourceVal.toLowerCase()) === 0;
                case "equals":
                    return targetVal.toLowerCase() === sourceVal.toLowerCase();
                default:
                    console.warn(`Invalid operator for string data type. Tried using "${operator}".`);
                    return false;
            }
        } else if (typeof targetVal === "object") {
            // numeric (int or decimal)
            switch (operator) {
                case "equals":
                    return targetVal.eq(sourceVal);
                case "greater_than":
                    return targetVal.gt(sourceVal);
                case "greater_than_or_equal":
                    return targetVal.gte(sourceVal);
                case "less_than":
                    return targetVal.lt(sourceVal);
                case "less_than_or_equal":
                    return targetVal.lte(sourceVal);
                default:
                    console.warn(`Invalid operator for numeric data type. Tried using "${operator}".`);
                    return false;
            }
        }
    };
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
SearchableListViewNative.displayName = "SearchableListViewNative";
