import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"
import appConfig from "../config.json";
import { ButtonSendSticker } from "../src/components/ButtonSendStickers"
import supabaseClient from "../config/db.js";

function escutaMensagensEmTempoReal(adicionaMensagem){
    return supabaseClient.from('mensagens')
        .on('INSERT', (res) => {
            adicionaMensagem(res.new)
        })
        .subscribe()
}

export default function ChatPage() {
    const roteamento = useRouter()
    const usuarioLogado = roteamento.query.username
    const [mensagem, setMensagem] = useState("");
    const [listaDeMensagens, setListaDeMensagens] = useState([]);

    useEffect(() => {
        supabaseClient.from('mensagens')
                        .select('*')
                        .order('id', {ascending: false})
                        .then(({ data }) => {
                            setListaDeMensagens(data)
                        })
        
        escutaMensagensEmTempoReal((novaMensagem) => {
            setListaDeMensagens((valorAtualDaLista) => {
                return [
                    novaMensagem,
                    ...valorAtualDaLista
                ]
            });
        })
    },[])

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            de: usuarioLogado,
            texto: novaMensagem,
        };

        supabaseClient.from('mensagens')
                        .insert([
                            mensagem
                        ])
                        .then(() => {
                            setMensagem('');
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
                    <MessageList mensagens={listaDeMensagens} setListaDeMensagens={setListaDeMensagens}/>
                    
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
                        
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                handleNovaMensagem(`:sticker:${sticker}`)
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
                            <Text 
                                tag="strong"
                                styleSheet={{
                                    fontFamily: 'Open Sans, sans-serif'
                                }}
                            >
                                {mensagem.de}
                            </Text>
                            
                            <Text
                                styleSheet={{
                                    fontSize: "10px",
                                    marginLeft: "8px",
                                    color: appConfig.theme.colors.neutrals[300],
                                    fontFamily: 'Open Sans, sans-serif'
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
                                {mensagem.texto.startsWith(':sticker:')
                                ?(
                                    <Image 
                                        src={mensagem.texto.replace(':sticker:', '')}
                                        styleSheet={{
                                            width: '20%'
                                        }}
                                    />
                                )
                                :(
                                    mensagem.texto
                                )}

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
