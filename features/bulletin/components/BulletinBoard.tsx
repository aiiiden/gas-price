import NoSSR from "@/components/NoSSR";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber } from "ethers";
import { useState } from "react";
import { useContract, useContractRead, useSigner } from "wagmi";
import ABI from "../abi.json";

const BulletinBoard = () => {
    const signer = useSigner();

    const contract = useContract({
        address: "0x54dB117e22C966af7C2B1ce416E6Eda3E8866931",
        abi: ABI,
        signerOrProvider: signer.data,
    });

    const { data: notices, refetch } = useContractRead({
        address: "0x54dB117e22C966af7C2B1ce416E6Eda3E8866931",
        abi: ABI,
        functionName: "getAllNotices",
    });

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!contract) return;

        console.log("title", title);
        console.log("content", content);

        if (!title || !content) return;

        const res = await contract.addNotice(title, content);

        await res.wait();

        refetch();
    };

    return (
        <NoSSR>
            <div className="flex justify-center items-center p-4">
                <ConnectButton />
            </div>

            <form
                onSubmit={handleSubmit}
                className="p-3 flex flex-col gap-2 justify-center"
            >
                <div>
                    <input
                        className="input input-bordered w-full"
                        placeholder="title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="input input-bordered w-full"
                        placeholder="content"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <button className="btn btn-primary">Submit</button>
            </form>

            <ul className="">
                {(notices as any[])?.map(
                    (notice: {
                        title: string;
                        content: string;
                        createdDate: BigNumber;
                    }) => (
                        <li
                            key={notice.createdDate.toString()}
                            className="p-4 border-b"
                        >
                            <h1>{notice.title}</h1>
                            <p>{notice.content}</p>
                            <p>
                                {new Date(
                                    notice.createdDate.toNumber() * 1000
                                ).toLocaleString()}
                            </p>
                        </li>
                    )
                )}
            </ul>
        </NoSSR>
    );
};

export default BulletinBoard;
