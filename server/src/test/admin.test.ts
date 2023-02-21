import { describe, expect, it } from "vitest";
import requset from "supertest";
import server from "../server";
import { UPLOADER_CONFIGURATION } from "../interfaces/configuration"

export const adminTest = describe("configuration test", async () => {
    it("admin can't login if password not correct", async () => {
        const res = await requset(server)
            .post("/admin/login")
            .send({ username: "adhi", password: "tuj" })

        expect(res.statusCode).toEqual(401)
    })

    let token: null | string = null

    await it("admin can login if password correct", async () => {
        const res = await requset(server)
            .post("/admin/login")
            .send({ username: "adhi", password: "tujuan" })

        token = res.body.token
        expect(res.statusCode).toEqual(200)
    })

    //configuration section

    const dumyConfiguration: UPLOADER_CONFIGURATION = {
        end: Date.now() + 1000000,
        choiches: ["A", "B"],
        dir: "E:\\uploader\\2022\\adi",
        file_types: ["image/png"],
        format_name: 2,
        kelas: "3P41",
        matkul: "Sistem Multimedia",
        max_size: 100000000,
        uploader_name: "Lab 1"
    }

   /* Testing the route /admin/config with the method POST. */
    it("admin can't update configuration if token not exist", async () => {
        const res = await requset(server)
            .post("/admin/config")
            .set("Authorization", "Bearer ")
            .send(dumyConfiguration)

        expect(res.statusCode).toEqual(401)
    })

    it("admin can't update configuration if token does expired", async () => {
        const res = await requset(server)
            .post("/admin/config")
            .set("Authorization", "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkaGkiLCJwYXNzd29yZCI6InR1anVhbiIsImlhdCI6MTY3Njg2MzI2MSwiZXhwIjoxNjc2ODYzNTYxfQ.dc6aY0Z6pYiQnGtW7j8EAF83SP1JNktA-bit8IKiJcg")
            .send(dumyConfiguration)

        expect(res.statusCode).toEqual(403)
    })

    it.skipIf(token)("admin can update configuration if token valid and not expired", async () => {
        const res = await requset(server)
            .post("/admin/config")
            .set("Authorization", "Bearer " + token)
            .send(dumyConfiguration)

        expect(res.statusCode).toEqual(200)
    })

})