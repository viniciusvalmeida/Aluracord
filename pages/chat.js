import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, { useState, useEffect } from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js"

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzQ4NTY1OSwiZXhwIjoxOTU5MDYxNjU5fQ.g0U99BmAIpk6CSbVEBAxflY8w-gQ2zXxbnGkvPIc98Q'
const SUPABASE_URL = 'https://nybwuzzgxmailyiuoynf.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function ChatPage() {
    const [user, setUser] = useState('')
    const [mensagem, setMensagem] = useState("");
    const [listaDeMensagens, setListaDeMensagens] = useState([]);

    useEffect(() => {
        supabaseClient.from('mensagens')
                        .select('*')
                        .order('id', {ascending: false})
                        .then(({ data }) => {
                            setListaDeMensagens(data)
                        })
        setUser(window.location.search.substring(1).split('?').toString())
    },[])

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            de: user,
            texto: novaMensagem,
        };

        supabaseClient.from('mensagens')
                        .insert([
                            mensagem
                        ])
                        .then(({data}) => {
                            setListaDeMensagens([
                                data[0],
                                ...listaDeMensagens
                            ]);
                            setMensagem("");
                        })
    }

    return (
        <Box
            styleSheet={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appConfig.theme.colors.primary["000"],
                backgroundImage: `url(https://tm.ibxk.com.br/2017/11/27/27220056648002.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",
                color: appConfig.theme.colors.neutrals["000"],
            }}
        >
            <Box
                styleSheet={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                    borderRadius: "5px",
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: "100%",
                    maxWidth: "95%",
                    maxHeight: "95vh",
                    padding: "32px",
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: "relative",
                        display: "flex",
                        flex: 1,
                        height: "80%",
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: "column",
                        borderRadius: "5px",
                        padding: "16px",
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} setListaDeMensagens={setListaDeMensagens} listaDeMensagens={listaDeMensagens}/>
                    
                    <Box
                        as="form"
                        styleSheet={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: "100%",
                                border: "0",
                                resize: "none",
                                borderRadius: "5px",
                                padding: "6px 8px",
                                backgroundColor:
                                    appConfig.theme.colors.neutrals[800],
                                marginRight: "12px",
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            variant="primary"
                            colorVariant="primary"
                            label="Enviar"
                            onClick={() => handleNovaMensagem(mensagem)}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

function Header() {
    return (
        <>
            <Box
                styleSheet={{
                    width: "100%",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text variant="heading5">Chat</Text>
                <Button
                    variant="tertiary"
                    colorVariant="primary"
                    label="Logout"
                    href="/"
                />
            </Box>
        </>
    );
}

function MessageList(props) {
    function deletarMsg(id) {
        supabaseClient
                    .from('mensagens')
                    .delete()
                    .match({id: id})
                    .then(({data}) => {
                        const novaLista = props.mensagens.filter(mensagem => mensagem.id !== data[0].id)
                        props.setListaDeMensagens([...novaLista])
                    })
    }

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: "auto",
                display: "flex",
                flexDirection: "column-reverse",
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: "16px"
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: "5px",
                            padding: "6px",
                            marginBottom: "12px",
                            hover: {
                                backgroundColor:
                                    appConfig.theme.colors.neutrals[700],
                            },
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: "8px",
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    marginRight: "8px",
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">{mensagem.de}</Text>
                            <Text
                                styleSheet={{
                                    fontSize: "10px",
                                    marginLeft: "8px",
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {new Date().toLocaleDateString()}
                            </Text>
                            <Box
                                styleSheet={{
                                width: "100%",
                                marginBottom: '8px',
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "10px"
                                }}
                            >
                                {mensagem.texto}
                                <Button
                                    variant="tertiary"
                                    colorVariant="primary"
                                    iconName="trash"
                                    onClick={() => deletarMsg(mensagem.id)}
                                />
                            </Box>
                        </Box>
                        {/* {mensagem.texto} */}
                    </Text>
                );
            })}
        </Box>
    );
}
