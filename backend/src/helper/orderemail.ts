export function buildOrderItems(items: any[]) {
    return items
        .map(
            (item) => `
<tr>
<td>${item.productname}</td>
<td align="center">${item.quantity}</td>
<td align="right">₹${item.subtotal}</td>
</tr>`
        )
        .join("")
}