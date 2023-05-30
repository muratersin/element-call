/*
Copyright 2022 New Vector Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useCallback } from "react";
import { Item } from "@react-stately/collections";
import { OverlayTriggerState } from "@react-stately/overlays";
import { useTranslation } from "react-i18next";

import { Button } from "../button";
import { Menu } from "../Menu";
import { PopoverMenuTrigger } from "../popover/PopoverMenu";
import { ReactComponent as SettingsIcon } from "../icons/Settings.svg";
import { ReactComponent as AddUserIcon } from "../icons/AddUser.svg";
import { ReactComponent as OverflowIcon } from "../icons/Overflow.svg";
import { ReactComponent as FeedbackIcon } from "../icons/Feedback.svg";
import { useModalTriggerState } from "../Modal";
import { SettingsModal } from "../settings/SettingsModal";
import { InviteModal } from "./InviteModal";
import { TooltipTrigger } from "../Tooltip";
import { FeedbackModal } from "./FeedbackModal";
import { Config } from "../config/Config";
import { MediaDevicesState } from "../settings/mediaDevices";

interface Props {
  roomId: string;
  mediaDevices: MediaDevicesState;

  inCall: boolean;
  showInvite: boolean;
  feedbackModalState: OverlayTriggerState;
  feedbackModalProps: {
    isOpen: boolean;
    onClose: () => void;
  };
}

export function OverflowMenu(props: Props) {
  const { t } = useTranslation();
  const {
    modalState: inviteModalState,
    modalProps: inviteModalProps,
  }: {
    modalState: OverlayTriggerState;
    modalProps: {
      isOpen: boolean;
      onClose: () => void;
    };
  } = useModalTriggerState();
  const {
    modalState: settingsModalState,
    modalProps: settingsModalProps,
  }: {
    modalState: OverlayTriggerState;
    modalProps: {
      isOpen: boolean;
      onClose: () => void;
    };
  } = useModalTriggerState();

  // TODO: On closing modal, focus should be restored to the trigger button
  // https://github.com/adobe/react-spectrum/issues/2444
  const onAction = useCallback(
    (key) => {
      switch (key) {
        case "invite":
          inviteModalState.open();
          break;
        case "settings":
          settingsModalState.open();
          break;
        case "feedback":
          props.feedbackModalState.open();
          break;
      }
    },
    [props.feedbackModalState, inviteModalState, settingsModalState]
  );

  const tooltip = useCallback(() => t("More"), [t]);

  return (
    <>
      <PopoverMenuTrigger disableOnState>
        <TooltipTrigger tooltip={tooltip} placement="top">
          <Button variant="toolbar">
            <OverflowIcon />
          </Button>
        </TooltipTrigger>
        {(attr: JSX.IntrinsicAttributes) => (
          <Menu {...attr} label={t("More menu")} onAction={onAction}>
            {props.showInvite && (
              <Item key="invite" textValue={t("Invite people")}>
                <AddUserIcon />
                <span>{t("Invite people")}</span>
              </Item>
            )}
            <Item key="settings" textValue={t("Settings")}>
              <SettingsIcon />
              <span>{t("Settings")}</span>
            </Item>
            {Config.get().rageshake?.submit_url && (
              <Item key="feedback" textValue={t("Submit feedback")}>
                <FeedbackIcon />
                <span>{t("Submit feedback")}</span>
              </Item>
            )}
          </Menu>
        )}
      </PopoverMenuTrigger>
      {settingsModalState.isOpen && (
        <SettingsModal
          mediaDevices={props.mediaDevices}
          {...settingsModalProps}
        />
      )}
      {inviteModalState.isOpen && (
        <InviteModal roomIdOrAlias={props.roomId} {...inviteModalProps} />
      )}
      {props.feedbackModalState.isOpen && (
        <FeedbackModal
          roomId={props.roomId}
          inCall={props.inCall}
          {...props.feedbackModalProps}
        />
      )}
    </>
  );
}
