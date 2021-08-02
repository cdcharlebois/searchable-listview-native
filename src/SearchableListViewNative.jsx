/*global mx*/
import { FlatList, View } from "react-native";
import { createElement, useEffect, useRef } from "react";
import { flattenStyles } from "./utils/common";
const defaultStyle = {
    container: {},
    // label: {},
    input: {}
};
export const SearchableListViewNative = ({
    datasource,
    content,
    style,
    constraints,
    emptyContent,
    loadingContent,
    showProgressBar
}) => {
    const pageSize = 500;
    const limit = useRef(pageSize);
    const pid = useRef(null);
    useEffect(() => {
        datasource.setLimit(limit.current);
    }, []);
    if (showProgressBar) {
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
    }
    const styles = flattenStyles(defaultStyle, style);
    const applyFilters = item =>
        constraints.every(constraint =>
            constraint.expression.get ? constraint.expression.get(item).value : constraint.expression(item).value
        );
    const loadNextPage = () => {
        limit.current += pageSize;
        datasource.setLimit(limit.current);
    };
    const filteredData = () => {
        if (datasource.items) {
            const filtered = datasource.items.filter(item => applyFilters(item));
            if (filtered.length < pageSize && datasource.totalCount && limit.current < datasource.totalCount) {
                loadNextPage();
                return [];
            } else {
                return filtered;
            }
        }
        return [];
    };

    if (datasource.status !== "available") {
        return <View>{loadingContent}</View>;
    } else {
        const data = filteredData();
        return data.length ? (
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (content.get ? content.get(item) : content(item))}
                    keyExtractor={item => item.id}
                    onEndReachedThreshold={0.5}
                    onEndReached={() => loadNextPage()}
                />
            </View>
        ) : (
            <View>{emptyContent}</View>
        );
    }
};
SearchableListViewNative.displayName = "FilterView";
