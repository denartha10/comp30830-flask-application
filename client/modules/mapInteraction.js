// //Add event listener not available for the AdvancedMarkerElement in the version of the API we are using
// //We can use Marker element instead of AdvancedMarkerElement since that is the version of the API we are using
// newMarker.addEventListener("mouseover", () => {
//     //hover box doesn't open if its selected
//     if (newMarker.title != "selected") {
//         infowindow.open({
//             anchor: newMarker,
//             map
//         });
//     }
// });
//
// newMarker.addEventListener("mouseout", () => {
//     infowindow.close();
// });
//
// newMarker.addEventListener("gmp-click", () => {
//     if (newMarker.title != "selected") {
//         //unselect all other pins;
//         for (id in sationDict) {
//             let pin = sationDict[id]["pin"];
//             let marker = sationDict[id]["marker"];
//             let tr_back = pin.background.slice(0, 18) + ", 0.4)";
//             let tr_bord = pin.borderColor.slice(0, 18) + ", 0.4)";
//             let tr_glyph = pin.borderColor.slice(0, 18) + ", 0.2)";
//             pin.background = tr_back;
//             pin.borderColor = tr_bord;
//             pin.glyphColor = tr_glyph;
//             pin.scale = 1;
//             marker.zIndex = 1;
//             marker.title = "not selected";
//         }
//         let sel_back = pinStyle.background.slice(0, 18) + ", 1)";
//         let sel_bord = pinStyle.borderColor.slice(0, 18) + ", 1)";
//         pinStyle.background = sel_back;
//         pinStyle.borderColor = sel_bord;
//         pinStyle.glyphColor = sel_bord;
//         pinStyle.scale = 1.3;
//         newMarker.zIndex = 2;
//         newMarker.title = "selected";
//         infowindow.close();
//         //select function
//         console.log(d);
//     } else {
//         //reshow all pins;
//         for (id in sationDict) {
//             let pin = sationDict[id]["pin"];
//             let marker = sationDict[id]["marker"];
//             let back = pin.background.slice(0, 18) + ", 1)";
//             let bord = pin.borderColor.slice(0, 18) + ", 1)";
//             pin.background = back;
//             pin.borderColor = bord;
//             pin.glyphColor = bord;
//             pin.scale = 1;
//             marker.zIndex = 1;
//             marker.title = "not selected";
//         }
//         //unselect all function
//     }
// });
