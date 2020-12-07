import { Component, createElement, useState, useEffect, useRef } from "react";
import { TextInput, View, FlatList } from "react-native";
import { flattenStyles } from "./utils/common";
const defaultStyle = {
    container: {},
    // label: {},
    input: {}
};

export const SearchableListViewNative = ({ datasource, content, attr, style, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState("");
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
        return datasource.items
            ? datasource.items.filter(item => {
                  return attr(item).value
                      ? attr(item)
                            .value.toLowerCase()
                            .indexOf(searchTerm.toLowerCase()) > -1
                      : false;
              })
            : [];
    };
    const loadNextPage = () => {
        limit.current += 20;
        datasource.setLimit(limit.current);
    };
    return datasource.items ? (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={(placeholder.status = "available" ? placeholder.value : "...")}
                value={searchTerm}
                onChangeText={searchTerm => {
                    setSearchTerm(searchTerm);
                    if (searchTerm != "" && searchTerm != null) {
                        datasource.setLimit(9999);
                    } else datasource.setLimit(limit.current);
                }}
            />
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
