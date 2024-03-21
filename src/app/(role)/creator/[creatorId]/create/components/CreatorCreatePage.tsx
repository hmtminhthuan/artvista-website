"use client";
import { PATH_SHOP } from "@/routes/paths";
import type { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import useAppContext from "@/hooks/useAppContext";
import TitlePageFrame from "@/components/Frame/TitlePageFrame";
import { Form, Input, Select } from "antd";
import { useFormik } from "formik";
import TextArea from "antd/es/input/TextArea";
import { formatPrice } from "@/utils/formatPrice";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import categoryManagementApi from "@/api/management/category";
import artworkManagementApi from "@/api/management/artwork";
import { ArtworkStatus } from "@/enums/artwork";
import { ArtworkDTO } from "@/types/market/ArtworkDTO";
import artworkMarketApi from "@/api/market/artwork";
import Loading from "@/components/Loading/Loading";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "@/config/firebaseConfig";
import { v4 } from "uuid";
import Swal from "sweetalert2";

export type CreatorCreateType = {
  editMode?: boolean;
};

const CreatorCreatePage: NextPage<CreatorCreateType> = ({ editMode }) => {
  const params = useParams();
  const creatorId = params.creatorId as string;
  const artworkId = params.artworkId as string;
  const router = useRouter();
  const { enableLoading, disableLoading, isLoading } = useAppContext();
  const [previewPrice, setPreviewPrice] = useState<number>(0);
  const [previewDiscount, setPreviewDiscount] = useState<number>(0);
  const [categoryList, setcategoryList] = useState<[]>([]);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [artworkDetail, setArtworkDetail] = useState<ArtworkDTO | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formItemLayout = {};
  const [form] = Form.useForm();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      artworkId: "",
      artworkName: "",
      price: 0,
      discount: 0,
      status: "",
      id: creatorId,
      categoryId: "",
      imageUrl: "",
      imageLocalPath: "",
      image: imageUpload,
      //postDTOs: null,
      //reportDTOs: null,
      description: "",
    },
    onSubmit: async (values) => {
      values.status = ArtworkStatus.Available;
      values.image = imageUpload;

      // artworkManagementApi
      //   .createNewArtwork(
      //     values.artworkId,
      //     values.artworkName,
      //     values.price,
      //     values.discount,
      //     ArtworkStatus.Available,
      //     values.id,
      //     values.categoryId,
      //     values.imageUrl,
      //     values.imageLocalPath,
      //     imageUpload ?? null,
      //     values.postDTOs,
      //     values.reportDTOs
      //   )
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      var imageUrlFirebase = "";
      if (imageUpload) {
        const imageRef = ref(firebaseStorage, `artworkImages/${v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref)
            .then((url) => {
              imageUrlFirebase = url;
            })
            .finally(async () => {
              values.imageUrl = imageUrlFirebase;

              const formData = new FormData();
              Object.entries(values).forEach(([key, value]) => {
                if (key === "image" && value) {
                  formData.append(key, value as File);
                } else {
                  formData.append(key, (value ?? "").toString());
                }
              });

              await artworkManagementApi
                .createArtwork(formData)
                .then((res) => {
                  console.log(res);
                  if (res.data.isSuccess) {
                    Swal.fire({
                      icon: "info",
                      title: `Create Artwork Successfully`,
                      html: `Let's return to see your showcase now`,
                      timerProgressBar: true,
                      showCancelButton: false,
                      showConfirmButton: true,
                      confirmButtonText: "Click here to continue",
                      showLoaderOnConfirm: true,
                      allowOutsideClick: false,
                    })
                      .then((result) => {
                        router.push(PATH_SHOP.creator.visitPage(creatorId));
                      })
                      .catch((err) => {});
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            });
        });
      }
    },
  });

  const renderCategory = () => {
    categoryManagementApi
      .getAllCategory()
      .then((response) => {
        if (
          response.data.isSuccess &&
          response.data.result &&
          response.data.result.isSuccess
        ) {
          setcategoryList(response.data.result.result);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const renderArtworkDetail = () => {
    enableLoading();
    artworkMarketApi
      .getAllArtworkMarketWithCondition()
      .then((response) => {
        if (response.data.isSuccess && response.data.result) {
          var artwork: ArtworkDTO = response.data.result.filter(
            (artwork: ArtworkDTO) => artwork.artworkId == artworkId
          )[0];
          setArtworkDetail(artwork);
          formik.setValues({
            artworkId: artwork.artworkId,
            artworkName: artwork.artworkName,
            price: artwork.price,
            discount: artwork.discount,
            status: artwork.status,
            id: creatorId,
            categoryId: artwork.categoryID,
            imageUrl: artwork.imageUrl,
            imageLocalPath: artwork.imageLocalPath ?? "",
            image: artwork.image,
            description: "",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        disableLoading();
      });
  };

  useEffect(() => {
    renderArtworkDetail();
    renderCategory();
  }, []);

  const handleChangeCategory = (categoryId: any) => {
    formik.setFieldValue("categoryId", categoryId);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageUpload(file);
      const link = URL.createObjectURL(file);
      setPreviewImg(link);
    }
  };

  if (editMode && !artworkDetail) {
    return <></>;
  }

  return (
    <>
      {editMode ? (
        <>
          <Loading loading={isLoading} />
        </>
      ) : (
        <></>
      )}
      <TitlePageFrame
        title={`${!editMode ? "Upload Your Art" : "Edit Your Art"}`}
        subtitle={`${!editMode ? "Upload the artwork you want to sell" : "Edit your existing artwork now"}`}
      />
      <div className="mt-10 self-stretch flex flex-row items-center justify-center max-w-full text-[1.056rem] text-neutral-white">
        <div className="w-[80.544rem] flex flex-row items-start justify-center gap-[4.231rem] max-w-full lg:flex-wrap mq750:gap-[4.231rem_2.125rem] mq450:gap-[4.231rem_1.063rem]">
          <div className="flex-1 flex flex-col items-start justify-start gap-[1.519rem] min-w-[26.063rem] max-w-full text-left text-[1.325rem] text-bg font-barlow mq750:min-w-full">
            <div className="w-[14.556rem] flex flex-row items-start justify-start pt-[0rem] pb-[0.269rem] pr-[0.875rem] pl-[0.862rem] box-border">
              <div className="flex-1 relative leading-[1.25rem] font-medium shrink-0 mq450:text-[1.063rem] mq450:leading-[0.938rem]">
                <p
                  onClick={() => {
                    if (!editMode) {
                      router.push(PATH_SHOP.creator.visitPage(creatorId));
                    } else {
                      router.push(PATH_SHOP.general.artworkDetail(artworkId));
                    }
                  }}
                  className="cursor-pointer my-0 mx-0 mb-4 text-whitesmoke text-[1.2rem]"
                >
                  {"< Back"}
                </p>
                Artwork Image
              </div>
            </div>
            <div
              onClick={() => {
                if (fileInputRef && fileInputRef.current && !editMode)
                  fileInputRef.current.click();
              }}
              className={`min-h-[20rem] ${!editMode ? "cursor-pointer" : ""} self-stretch flex flex-row items-start justify-start py-[0rem] pr-[0.75rem] pl-[0.662rem] box-border max-w-full text-center text-[0.925rem]`}
            >
              {!(imageUpload && previewImg) && !editMode ? (
                <>
                  <div className="flex-1 rounded-[10.58px] box-border overflow-hidden flex flex-col items-center justify-start pt-[13.775rem] px-[1.25rem] pb-[11.125rem] relative gap-[1.587rem] max-w-full border-[1.1px] border-dashed border-dimgray-500 mq750:pt-[8.938rem] mq750:pb-[7.25rem] mq750:box-border">
                    <img
                      className="w-[1.588rem] h-[1.588rem] absolute !m-[0] top-[11.125rem] left-[17.5rem] overflow-hidden shrink-0"
                      loading="lazy"
                      alt=""
                      src={"/images/creator/upload_image_icon.svg"}
                    />
                    <div className="w-[18.313rem] relative leading-[1.375rem] flex items-center justify-center">
                      PNG, JPG, or JPEG.
                    </div>
                    <div className="header_links_hover w-[18.375rem] flex flex-row items-start justify-center py-[0rem] pr-[0.063rem] pl-[0rem] box-border">
                      <button className="cursor-pointer pt-[0.525rem] px-[1.938rem] pb-[0.531rem] bg-[transparent] rounded-[31.74px] flex flex-row items-start justify-start border-[1.1px] border-solid border-primary-colour hover:bg-blueviolet-200 hover:box-border hover:border-[1.1px] hover:border-solid hover:border-blueviolet-100">
                        <div className="w-[2.875rem] relative text-[0.925rem] leading-[1.438rem] font-semibold font-barlow text-primary-colour text-center inline-block min-w-[2.875rem]">
                          Upload
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}

              {imageUpload && previewImg && !editMode ? (
                <img
                  className="w-full h-full"
                  style={{ borderRadius: "8px" }}
                  loading="lazy"
                  alt=""
                  key={previewImg}
                  src={previewImg}
                />
              ) : (
                ""
              )}

              {editMode ? (
                <img
                  className="w-full h-full"
                  style={{ borderRadius: "8px" }}
                  loading="lazy"
                  alt=""
                  src={artworkDetail?.imageUrl.split("://example")[0]}
                />
              ) : (
                ""
              )}
            </div>

            {imageUpload && previewImg && !editMode ? (
              <>
                <div className="w-full flex flex-row items-start justify-center py-[0rem] pr-[0.063rem] pl-[0rem] box-border">
                  <button
                    onClick={() => {
                      if (fileInputRef && fileInputRef.current && !editMode)
                        fileInputRef.current.click();
                    }}
                    className="header_links_hover cursor-pointer pt-[0.525rem] px-[1.938rem] pb-[0.531rem] bg-[transparent] rounded-[31.74px] flex flex-row items-start justify-start border-[1.1px] border-solid border-primary-colour hover:bg-blueviolet-200 hover:box-border hover:border-[1.1px] hover:border-solid hover:border-blueviolet-100"
                  >
                    <div className="w-full relative text-[0.925rem] leading-[1.438rem] font-semibold font-barlow text-primary-colour text-center inline-block min-w-[2.875rem]">
                      Upload another art
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="w-[36.169rem] flex flex-col items-start justify-start px-[0rem] pb-[0rem] box-border min-w-[36.169rem] max-w-full lg:flex-1 mq750:min-w-full">
            <Form
              onFinish={formik.handleSubmit}
              {...formItemLayout}
              form={form}
              size="large"
              autoComplete="off"
              className="w-full"
            >
              <div className="row align-items-start justify-content-between">
                <p className="text-neutral-white relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                  <span>
                    Artwork name
                    <span className="text-red">*</span>
                  </span>
                </p>
                <Form.Item
                  className="col-sm-12 col-md-7 mx-0 px-0"
                  name="artworkName"
                  label=""
                  rules={[
                    {
                      required: true,
                      message: "Artwork name cannot be blank",
                    },
                    {
                      message: "Artwork name is not in correct form",
                      pattern:
                        /^(([\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,}[\S^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,})|([\S^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,1}))$/,
                    },
                  ]}
                  hasFeedback
                  initialValue={editMode ? formik.values.artworkName : ""}
                >
                  <Input
                    className="mt-[0.1rem]"
                    name="artworkName"
                    value={formik.values.artworkName}
                    onChange={formik.handleChange}
                    placeholder="Enter artwork name"
                  />
                </Form.Item>
              </div>

              <div className="row mt-8 align-items-start justify-content-between">
                <p className="text-neutral-white relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                  <span>Description</span>
                </p>
                <Form.Item
                  className="col-sm-12 col-md-7 mx-0 px-0"
                  name="description"
                  label=""
                  rules={[
                    {
                      required: false,
                    },
                    {
                      pattern: /^(([]{0,0})|([\w]{1,1}[\w\s,]{0,}))$/,
                      message: "Description is not in correct form",
                    },
                  ]}
                  hasFeedback
                  //initialValue={editMode ? formik.values.artworkName : ""}
                >
                  <TextArea
                    className="mt-[0.1rem]"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    placeholder="Enter description (Optional)"
                  />
                </Form.Item>
              </div>

              <div className="row mt-8 align-items-start justify-content-between">
                <p className="text-neutral-white relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                  <span>
                    Price
                    <span className="text-red">*</span>
                  </span>
                </p>
                <Form.Item
                  className="col-sm-12 col-md-7 mx-0 px-0"
                  name="price"
                  label=""
                  rules={[
                    {
                      required: true,
                      message: "Price is not in correct form",
                    },
                    {
                      pattern:
                        /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/,
                      message: "Price must be a positive number",
                    },
                    {
                      whitespace: true,
                      message: "Price cannot be empty",
                    },
                  ]}
                  hasFeedback
                  initialValue={editMode ? formik.values.price : ""}
                >
                  <Input
                    className="mt-[0.1rem]"
                    style={{ width: "100%" }}
                    name="price"
                    value={formik.values.price}
                    onChange={(e) => {
                      setPreviewPrice(parseFloat(e.target.value));
                      formik.setFieldValue("price", parseFloat(e.target.value));
                    }}
                    placeholder="Enter artwork price"
                  />
                </Form.Item>
              </div>

              <div className="row mt-8 align-items-start justify-content-between">
                <p className="text-neutral-white relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                  <span>
                    Discount
                    <span className="text-red">*</span>
                  </span>
                </p>
                <Form.Item
                  className="col-sm-12 col-md-7 mx-0 px-0"
                  name="discount"
                  label=""
                  rules={[
                    {
                      required: true,
                      message: "Discount is not in correct form",
                    },
                    {
                      pattern: /^(100(\.0+)?|\d{1,2}(\.\d+)?)$/,
                      message: "Discount must be a number between 0 and 100",
                    },
                  ]}
                  hasFeedback
                  initialValue={editMode ? formik.values.discount : 0}
                >
                  <Input
                    className="mt-[0.1rem]"
                    style={{ width: "100%" }}
                    name="discount"
                    value={formik.values.discount}
                    onChange={(e) => {
                      setPreviewDiscount(parseFloat(e.target.value));
                      formik.setFieldValue(
                        "discount",
                        parseFloat(e.target.value)
                      );
                    }}
                    placeholder="Enter artwork discount"
                  />
                </Form.Item>
              </div>

              <div className="text-neutral-white text-[1.2rem]">
                {previewPrice > 0 &&
                (previewDiscount <= 0 || !previewDiscount) ? (
                  <p className="p-0 m-0 preview-item-content text-primary">
                    <span className="text-neutral-white">Preview Price: </span>
                    {formatPrice(previewPrice)}
                    {" VND "}
                  </p>
                ) : (
                  <></>
                )}

                {previewPrice > 0 &&
                previewDiscount > 0 &&
                previewDiscount <= 100 ? (
                  <p className="p-0 m-0 preview-item-content text-primary">
                    <span className="text-neutral-white">Preview Price: </span>
                    <span className="">
                      {formatPrice(previewPrice)}
                      {" VND "}
                    </span>
                    <span className="ps-1">(Discount: {previewDiscount}%)</span>
                    <span className="text-danger">
                      <span className="text-neutral-white">{" => "}</span>
                      <span>
                        {formatPrice(
                          previewPrice * (1 - previewDiscount / 100)
                        )}
                        {" VND "}
                      </span>
                    </span>
                  </p>
                ) : (
                  <></>
                )}
              </div>

              <div className="row mt-8 align-items-start justify-content-between">
                <p className="text-neutral-white relative self-stretch pb-1 text-lg font-medium leading-[28px]">
                  <span>
                    Category
                    <span className="text-red">*</span>
                  </span>
                </p>
                <Form.Item
                  className="col-sm-12 col-md-7 mx-0 px-0"
                  name="categoryId"
                  label=""
                  rules={[
                    {
                      required: true,
                      message: "Category must be selected",
                    },
                  ]}
                  hasFeedback
                  initialValue={editMode ? formik.values.categoryId : ""}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select category"
                    value={formik.values.categoryId}
                    onChange={handleChangeCategory}
                  >
                    {categoryList.map(({ categoryId, categoryName }, index) => {
                      return (
                        <Select.Option key={index} value={categoryId}>
                          {categoryName}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </div>

              <input
                ref={fileInputRef}
                style={{
                  width: "100%",
                  cursor: "pointer",
                  display: "none",
                }}
                name="img"
                placeholder="Select Image"
                id="imgInp"
                type="file"
                onChange={(e) => {
                  const fileList = e.target.files;
                  if (fileList && fileList.length > 0) {
                    setImageUpload(fileList[0]);
                    const file = fileList[0];
                    const link = URL.createObjectURL(file);
                    setPreviewImg(link);
                  }
                }}
              />

              <Form.Item className="text-center">
                <div className="flex flex-row mt-5">
                  <button
                    type="submit"
                    style={{ width: "50%" }}
                    className="mr-2 hover:bg-blueviolet box-border flex max-w-full flex-1 cursor-pointer flex-row items-start justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary-colour px-5 py-[21px] [border:none]"
                  >
                    <div className="font-barlow relative flex w-full items-center justify-center text-center text-lg font-medium text-neutral-white">
                      {!editMode ? "Upload" : "Save"}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      if (!editMode) {
                        router.push(PATH_SHOP.creator.visitPage(creatorId));
                      } else {
                        router.push(PATH_SHOP.general.artworkDetail(artworkId));
                      }
                    }}
                    type="button"
                    style={{ width: "50%" }}
                    className="ms-2 hover:bg-blueviolet box-border flex max-w-full flex-1 cursor-pointer flex-row items-start justify-center overflow-hidden whitespace-nowrap rounded-md bg-black px-5 py-[21px] [border:none]"
                  >
                    <div className="font-barlow relative flex w-full items-center justify-center text-center text-lg font-medium text-neutral-white">
                      Cancel
                    </div>
                  </button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorCreatePage;
