// import { describe, expect, it } from "vitest";
// import requset from "supertest";
// import server, { useConfig } from "../server";
// import { adminTest } from "./admin.test";

// describe("delete file", () => {
//     it("can delete the file/ 200", async () => {
//         const res = await requset(server)
//             .delete("/upload")
//             .send({ "nim": "21.240.0055", "name": "adhi" })

//         expect(res.statusCode).toEqual(200)
//     })

//     it("can't delete delete the file/ 404", async () => {
//         const res = await requset(server)
//             .delete("/upload")
//             .send({ "nim": "21.240.0055", "name": "adhi" })

//         expect(res.statusCode).toEqual(404)
//     })
// })

// describe("upload file", async () => {
//     await adminTest
//     it("can upload file POST/ 200", async () => {
//         const res = await requset(server)
//             .post("/upload")
//             .field("nim", "21.240.0055")
//             .field("name", "Adhi")
//             .attach("file-data", "src/test/assets/test.png")

//         expect(res.statusCode).toEqual(200)
//     })

//     it("can't upload file because user nim already exist POST/ 403", async () => {
//         const res = await requset(server)
//             .post("/upload")
//             .field("nim", "21.240.0055")
//             .field("name", "Adhi")
//             .attach("file-data", "src/test/assets/test.png")
            
//         expect(res.statusCode).toEqual(403)
//     })

//     it("can't upload file is not uploaded POST/ 404", async () => {
//         const res = await requset(server)
//             .post("/upload")
//             .field("field", '{ "nim": "21.240.0035", "name": "adhi" }')

//         expect(res.statusCode).toEqual(404)
//     })

//     it("can't upload file because configuration does not exists POST/ 501", async () => {
//         useConfig(null, true)
//         const res = await requset(server)
//             .post("/upload")
//             .field("nim", "21.240.0055")
//             .field("name", "Adhi")
//             .attach("file-data", "src/test/assets/test.png")

//         expect(res.statusCode).toEqual(501)
//     })
// }, 2000)

