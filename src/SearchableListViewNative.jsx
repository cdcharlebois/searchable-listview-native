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
    const pid = useRef(null);
    useEffect(() => {
        if (datasource.status !== "available" && pid.current == null) {
            pid.current = mx.ui.showProgress();
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
    return datasource.items ? (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={(placeholder.status = "available" ? placeholder.value : "...")}
                value={searchTerm}
                onChangeText={searchTerm => setSearchTerm(searchTerm)}
            />
            <FlatList data={filteredData()} renderItem={({ item }) => content(item)} keyExtractor={item => item.id} />
        </View>
    ) : null;
};
SearchableListViewNative.displayName = "SearchableListViewNative";
