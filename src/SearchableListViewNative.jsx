/*global mx*/
import { FlatList, View } from "react-native";
import { createElement, useEffect, useRef } from "react";
import { flattenStyles } from "./utils/common";
const defaultStyle = {
    container: {},
    // label: {},
    input: {}
};
export const SearchableListViewNative = ({ datasource, content, style, constraints, emptyContent }) => {
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
    const loadNextPage = () => {
        limit.current += 20;
        datasource.setLimit(limit.current);
    };
    const filteredData = () => {
        if (datasource.items) {
            const filtered = datasource.items.filter(item => applyFilters(item));
            if (filtered.length === 0 && datasource.totalCount && limit.current < datasource.totalCount) {
                loadNextPage();
                return [];
            } else {
                return filtered;
            }
        }
        return [];
    };

    const data = filteredData();
    return data.length ? (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={({ item }) => content(item)}
                keyExtractor={item => item.id}
                onEndReachedThreshold={0.5}
                onEndReached={() => loadNextPage()}
            />
        </View>
    ) : (
        <View>{emptyContent}</View>
    );
};
SearchableListViewNative.displayName = "FilterView";
