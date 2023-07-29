import initData from "../mockData/initData";
import categories from "../mockData/categories";
import iconDelete from "../../images/icon-delete.svg";
import iconArchive from "../../images/icon-archived.svg";
import iconEdit from "../../images/icon-edit.svg";
import emitter from "../../utils/eventEmitter";
import parseDate from "../../utils/parseDate";
import handleCreateNoteBtnClick from "./addNote";
import handleEditBtnClick from "./editNote";

let renderedData = initData.filter((item) => !item.archived);

const handleArchiveBtnClick = (recordId) => {
    const itemToUpdate = initData.find((item) => item.recordId === recordId);
    if (itemToUpdate) {
        itemToUpdate.archived = !itemToUpdate.archived;
        emitter.emit("dataChanged");
    }
};

emitter.on("dataChanged", () => {
    renderedData = initData.filter((item) => !item.archived);
    const tableBody = activeList.querySelector("tbody");
    tableBody.innerHTML = generateTableRows();
});

const handleDeleteBtnClick = (recordId) => {
    const itemDeleteByIndex = initData.findIndex(
        (item) => item.recordId === recordId
    );
    if (itemDeleteByIndex !== -1) {
        initData.splice(itemDeleteByIndex, 1);
        emitter.emit("dataChanged");
    }
};

const handleBtnClick = (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const recordId =
        btn.dataset.archive || btn.dataset.edit || btn.dataset.delete;
    if (btn.dataset.archive) {
        handleArchiveBtnClick(recordId);
    } else if (btn.dataset.edit) {
        handleEditBtnClick(recordId);
    } else if (btn.dataset.delete) {
        handleDeleteBtnClick(recordId);
    }
};

const generateTableRows = () => {
    let rowsHtml = "";

    for (const item of renderedData) {
        const { categoryName, createDate, content } = item;
        const category = categories.find(
            (cat) => cat.categoryId === item.categoryId
        );

        const date = new Date(createDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });

        const rowHtml = `
      <tr class="flex justify-between items-center text-left py-2 px-2 bg-white border border-teal-500 rounded-md overflow-hidden shadow-sm hover:shadow-md">
        <td class="w-[55px] shrink-0 overflow-ellipsis whitespace-nowrap overflow-hidden">
        <div class="bg-teal-300 p-2 rounded-full flex justify-center w-[50px] h-[50px]">
          <img src="${category.categoryImg}" alt="${
            category.categoryName
        }" width="20" height="20"/>
        </div>
        </td>
        <td class="w-[120px] shrink-0 text-gray-800 text-[18px] font-semibold truncate text-ellipsis white-space: nowrap">${
            item.nameTitle
        }</td>
        <td class="w-[135px] shrink-0">${date}</td>
        <td class="w-[130px] shrink-0">${categoryName}</td>
        <td class="w-[170px] shrink-0 truncate text-ellipsis white-space: nowrap">${content}</td>
        <td class="w-[130px] shrink-0">
              ${parseDate(content)}
        </td>
        <td class="flex gap-5  w-[130px] shrink-0">
            <div class="flex gap-2">
                <button class="hover:shadow-md p-2 hover:bg-teal-100 rounded-[4px]" data-edit=${
                    item.recordId
                }>
                    <img src=${iconEdit} alt="Icon edit" width="20" height="20"/>
                </button>
                <button class="hover:shadow-md p-2 hover:bg-teal-100 rounded-[4px]" data-archive=${
                    item.recordId
                }>
                    <img src=${iconArchive} alt="Icon archive" width="20" height="20"/>
                </button>
                <button class="hover:shadow-md p-2 hover:bg-teal-100 rounded-[4px]" data-delete=${
                    item.recordId
                }>
                    <img src=${iconDelete} alt="Icon delete" width="20" height="20"/>
                </button>
            </div>
        </td>
      </tr>
    `;

        rowsHtml += rowHtml;
    }

    return rowsHtml;
};

const activeList = document.createElement("section");
activeList.classList.add("text-gray-800", "w-full");
const tableActiveList = /*html*/ `
    <h1 class="text-[40px] font-bold">Active list</h1>
    <table class=' relative
    flex
    flex-col
    rounded-md
    text-description
    gap-[10px]
    text-base
    font-normal
    mt-4
    '>
    <thead>
        <tr class=" flex justify-between text-left text-[20px] font-semibold py-4 px-2 bg-teal-200 border border-teal-700 rounded-[4px] overflow-hidden shadow-sm hover:shadow-md">
        <th class="w-[55px] shrink-0"></th>
        <th class="w-[130px] shrink-0">Name</th>
        <th class="w-[135px] shrink-0">Created</th>
        <th class="w-[130px] shrink-0">Category</th>
        <th class="w-[175px] shrink-0">Content</th>
        <th class="w-[130px] shrink-0">Dates</th>
        <th class="w-[130px] shrink-0">
            <div class="flex gap-2 justify-end">
                <div class="p-2">
                    <img src=${iconArchive} alt="Icon archive" width="20" height="20"/>
                </div>
                <div class="p-2">
                    <img src=${iconDelete} alt="Icon delete" width="20" height="20"/>
                </div>
            </div>
        </th>
        </tr>
    </thead>
    <tbody class="flex flex-col gap-[10px] text-gray-600">
        ${generateTableRows()}
    </tbody>
    </table>
    <button class="text-gray-800 font-bold text-[18px] border-2 px-3 py-1 rounded-lg border-teal-800 bg-teal-200 hover:bg-teal-800 hover:text-white block mt-4 ml-auto" data-create-note>Create Note</button>
`;

activeList.innerHTML = tableActiveList;
const tableBody = activeList.querySelector("tbody");
tableBody.addEventListener("click", handleBtnClick);

const createNoteBtn = activeList.querySelector("[data-create-note]");
createNoteBtn.addEventListener("click", handleCreateNoteBtnClick);

export default activeList;
