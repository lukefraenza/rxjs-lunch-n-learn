
export namespace helpers {

    export function addItem(val: any) {
        var node = document.createElement('li');
        var textnode = document.createTextNode(val);
        node.appendChild(textnode);
        document.getElementById('output').appendChild(node);
    };

}