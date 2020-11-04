import { Component, createElement, useState } from "react";
import { TextInput, View } from "react-native";
import { SearchableFlatList } from "react-native-searchable-list";
import { flattenStyles } from "./utils/common";
const defaultStyle = {
    container: {},
    // label: {},
    input: {}
};

export const SearchableListViewNative = ({ datasource, content, attr, style, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const styles = flattenStyles(defaultStyle, style);
    const data =
        datasource.status !== "available"
            ? null
            : datasource.items.map(item => ({
                  id: item.id,
                  attrVal: attr(item).value,
                  objItem: item
              }));
    return datasource.status !== "available" ? null : (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={(placeholder.status = "available" ? placeholder.value : "...")}
                value={searchTerm}
                onChangeText={searchTerm => setSearchTerm(searchTerm)}
            />
            <SearchableFlatList
                data={data}
                searchTerm={searchTerm}
                searchAttribute={"attrVal"}
                ignoreCase={true}
                renderItem={({ item }) => content(item.objItem)}
                keyExtractor={item => item.id}
            />
        </View>
    );
};
SearchableListViewNative.displayName = "SearchableListViewNative";
